import {useEffect, useState} from 'react';
import './Completion.css';

function Completion(props) {
  const [ messageBody, setMessageBody ] = useState('');
  const { stripePromise } = props;

  useEffect(() => {
    if (!stripePromise) return;

    stripePromise.then(async (stripe) => {
      const url = new URL(window.location);
      const clientSecret = url.searchParams.get('payment_intent_client_secret');
      const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

      setMessageBody(error ? ` ${error.message}` : ` Paiement réussi !`);
    });
  }, [stripePromise]);

  return (
    <div id='validated-page'>
      <img src="/icons/check.svg" alt="Paiement réussi" />
      <h2>Merci à vous</h2>
      <div id="messages" role="alert" style={messageBody ? {display: 'block'} : {}}>{messageBody}</div>
      <div id="messages" role="alert" style={messageBody ? {display: 'block'} : {}}>Votre commande a été enregistrée avec succès.</div>
    </div>
  );
}

export default Completion;