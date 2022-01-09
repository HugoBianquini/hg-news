/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// Function to read stripe stream returned by webhook
async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false,
    }
}

const relevantEvents = new Set(['checkout.session.completed'])

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST') {
        const buf = await buffer(req);
        const secret = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_LOCAL_WEBHOOK_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook error: ${err.message}`);
        }

        const { type } = event;

        if(relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'checkout.session.completed':

                        const checkouSession = event.data.object as Stripe.Checkout.Session;

                        console.log(checkouSession);
                        
                        await saveSubscription(
                            checkouSession.subscription.toString(),
                            checkouSession.customer.toString()
                        )

                        break;
                    default:
                        throw new Error('Unhandled event');
                }
            } catch (err) {
                return res.json(`Webhook handler failed: ${err.message}`);
            }
        }

        return res.json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not Allowed')
    }
}

/* Listening webhooks from stripe using stripe CLI to test locally
*
* stripe listen --forward-to localhost:3000/api/webhooks
* 
*/