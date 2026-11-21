import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRODUCTS = [
  { id: 'tote', name: 'Everyday Tote', priceCents: 2400, marker: 'TOTE', shape: 'tote' },
  { id: 'notebook', name: 'Desk Notebook', priceCents: 1200, marker: 'NOTES', shape: 'notebook' },
];

const formatMoney = (cents) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

function ProductMarker({ product }) {
  return (
    <div className={`product-marker ${product.shape}`} aria-hidden="true">
      {product.shape === 'tote' ? (
        <>
          <span className="tote-handle" />
          <span className="tote-mark">{product.marker}</span>
        </>
      ) : (
        <>
          <span className="notebook-spine" />
          <span className="notebook-mark">{product.marker}</span>
        </>
      )}
    </div>
  );
}

function App() {
  const [cart, setCart] = useState({});
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [cartError, setCartError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const nameInputRef = useRef(null);
  const placedRef = useRef(false);

  const cartItems = useMemo(
    () => PRODUCTS.filter((product) => cart[product.id]).map((product) => ({
      ...product,
      quantity: cart[product.id],
    })),
    [cart],
  );

  const subtotalCents = cartItems.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );

  const addItem = (product) => {
    setCart((current) => ({ ...current, [product.id]: current[product.id] ? current[product.id] : 1 }));
    setCartError('');
  };

  const changeQuantity = (productId, delta) => {
    setCart((current) => ({
      ...current,
      [productId]: Math.max(1, (current[productId] || 1) + delta),
    }));
  };

  const removeItem = (productId) => {
    setCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  };

  const placeOrder = (event) => {
    event.preventDefault();
    if (placedRef.current) return;

    const trimmedName = name.trim();
    const hasCart = cartItems.length > 0;
    setNameError(trimmedName ? '' : 'Enter your full name to place the order.');
    setCartError(hasCart ? '' : 'Add at least one item to place the order.');

    if (!trimmedName) {
      nameInputRef.current?.focus();
      return;
    }
    if (!hasCart) return;

    placedRef.current = true;
    setConfirmation({ reference: `FG-${Math.floor(10000 + Math.random() * 90000)}` });
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="FIELD / GOODS checkout">
          FIELD <span>/</span> GOODS
        </a>
        <div className="header-context">
          <span className="checkout-label">Checkout</span>
          <span className="step-label">01 — Review &amp; place order</span>
        </div>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="secure-badge">SECURE CHECKOUT</p>
            <h1 id="page-title">A few good things.</h1>
            <p className="intro-copy">Review your order, then tell us who it’s for.</p>
          </div>
        </section>

        {confirmation ? (
          <section className="confirmation" role="status" aria-live="polite" aria-labelledby="confirmation-title">
            <p className="confirmation-kicker">Order confirmed</p>
            <h2 id="confirmation-title">Thank you, {name.trim()}.</h2>
            <p>Your local demonstration order is complete.</p>
            <p className="order-reference">Order reference <strong>{confirmation.reference}</strong></p>
          </section>
        ) : null}

        <div className="checkout-grid">
          <section className="products" aria-labelledby="order-items-heading">
            <div className="section-heading">
              <p className="section-number">01</p>
              <h2 id="order-items-heading">Your items</h2>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart" role="status">
                <p>Your cart is empty.</p>
                <span>Choose something below to begin.</span>
              </div>
            ) : (
              <div className="cart-list" aria-label="Cart items">
                {cartItems.map((item) => (
                  <article className="cart-row" key={item.id}>
                    <ProductMarker product={item} />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>{formatMoney(item.priceCents)} each</p>
                    </div>
                    <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() => changeQuantity(item.id, -1)}
                        disabled={item.quantity === 1}
                      >
                        −
                      </button>
                      <span className="quantity" aria-label={`${item.quantity} ${item.name} in cart`}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() => changeQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="line-total">
                      <span>Line total</span>
                      <strong>{formatMoney(item.priceCents * item.quantity)}</strong>
                    </div>
                    <button type="button" className="remove-button" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            )}

            <div className="product-catalog" aria-label="Available products">
              {PRODUCTS.map((product) => {
                const inCart = Boolean(cart[product.id]);
                return (
                  <article className="catalog-row" key={product.id}>
                    <ProductMarker product={product} />
                    <div className="catalog-info">
                      <h3>{product.name}</h3>
                      <p>{formatMoney(product.priceCents)}</p>
                    </div>
                    <button
                      type="button"
                      className="add-button"
                      onClick={() => addItem(product)}
                      disabled={inCart}
                      aria-label={inCart ? `${product.name} already in order` : `Add ${product.name} to order`}
                    >
                      {inCart ? 'Added' : 'Add to order'}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="summary-column" aria-label="Order summary and customer details">
            <section className="summary" aria-labelledby="summary-heading">
              <div className="section-heading compact">
                <p className="section-number">02</p>
                <h2 id="summary-heading">Order summary</h2>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatMoney(subtotalCents)}</span>
              </div>
              <div className="summary-total" aria-live="polite" aria-atomic="true">
                <span>Order total</span>
                <strong>{formatMoney(subtotalCents)}</strong>
              </div>
            </section>

            <form className="checkout-form" onSubmit={placeOrder} noValidate>
              <div className="section-heading compact">
                <p className="section-number">03</p>
                <h2>Customer details</h2>
              </div>
              <label htmlFor="full-name">Full name <span aria-hidden="true">*</span></label>
              <input
                ref={nameInputRef}
                id="full-name"
                name="fullName"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (event.target.value.trim()) setNameError('');
                }}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? 'name-error' : undefined}
              />
              {nameError ? (
                <p className="field-error" id="name-error" role="alert">{nameError}</p>
              ) : null}
              {cartError ? (
                <p className="field-error" role="alert">{cartError}</p>
              ) : null}

              <button
                type="submit"
                className="place-order"
                disabled={Boolean(confirmation)}
              >
                {confirmation ? 'Order placed' : 'Place order'}
              </button>
              <p className="demo-note">Local demonstration — no payment is processed.</p>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
