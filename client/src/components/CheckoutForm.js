import {
    PaymentElement,
    LinkAuthenticationElement
  } from '@stripe/react-stripe-js'
  import {useState} from 'react'
  import {useStripe, useElements} from '@stripe/react-stripe-js';
  
  export default function CheckoutForm(props) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      setIsLoading(true);
      // if (CGV are not accepted) { setMessage("Veuillez accepter les CGV"); return; } 
      if (!document.getElementById('accept-cgv').checked) { setMessage("Veuillez accepter les conditions générales de vente"); setIsLoading(false); return; }
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/completion`,
        },
      });
  
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("Une erreur inattendue est survenue.");
      }
  
      setIsLoading(false);
    }
  
    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement id="link-authentication-element"
          options={{defaultValues: {email: props.email}}}
          />
        <PaymentElement id="payment-element" />
        <div>
          <label htmlFor='accept-cgv'>J'accepte les conditions générales de vente</label>
          <input type='checkbox' id='accept-cgv' name='accept-cgv' />
        </div>
        <button className='button' disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Payer maintenant"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    )
  }