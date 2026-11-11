import { Component, createContext, CSSProperties, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, Check, Clock3, Facebook, ForkKnife, Heart, Instagram, MapPin,
  Minus, Phone, Plus, ShoppingBag, Trash2, X,
} from 'lucide-react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { cafeImages, coldDrinks, MenuItem, menuCategories } from '@/data/menu';

type CartItem = { id: string; name: string; image: string; size?: string; price: number; quantity: number };
type CartContextValue = { items: CartItem[]; addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void; changeQuantity: (id: string, amount: number) => void; removeItem: (id: string) => void; clearCart: () => void; subtotal: number; count: number; cartOpen: boolean; openCart: () => void; closeCart: () => void };
type LightboxItem = { src: string; title: string };

const CartContext = createContext<CartContextValue | null>(null);
const navLinks = [{ label: 'Home', path: '/' }, { label: 'Menu', path: '/menu' }, { label: 'About', path: '/about' }, { label: 'Gallery', path: '/gallery' }, { label: 'Contact', path: '/contact' }];
const categoryTiles = [
  { label: 'Pizzas', id: 'pizzas', image: 'https://images.pexels.com/photos/19786209/pexels-photo-19786209.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Steaks', id: 'steaks', image: 'https://images.pexels.com/photos/765082/pexels-photo-765082.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Burgers', id: 'fast-food', image: 'https://images.pexels.com/photos/5374419/pexels-photo-5374419.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Wings', id: 'fast-food', image: 'https://images.pexels.com/photos/14661492/pexels-photo-14661492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Chinese & Thai', id: 'chinese-thai', image: 'https://images.pexels.com/photos/40263070/pexels-photo-40263070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Drinks', id: 'drinks', image: 'https://images.pexels.com/photos/36880408/pexels-photo-36880408.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('Cart must be used inside CartProvider');
  return value;
}

function CartProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(() => {
    try { const parsed = JSON.parse(localStorage.getItem('ventose-cart') ?? '[]'); if (!Array.isArray(parsed)) return []; return parsed.map((entry: Partial<CartItem>) => ({ id: String(entry.id ?? ''), name: String(entry.name ?? 'Unknown item'), image: String(entry.image ?? ''), size: entry.size ?? undefined, price: Number(entry.price) || 0, quantity: Math.max(1, Number(entry.quantity) || 1) })); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('ventose-cart', JSON.stringify(items)); }, [items]);
  useEffect(() => { document.body.style.overflow = cartOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [cartOpen]);
  const addItem = (item: Omit<CartItem, 'id' | 'quantity'>) => setItems((current) => {
    const id = `${item.name}-${item.size ?? 'standard'}`;
    const existing = current.find((cartItem) => cartItem.id === id);
    return existing ? current.map((cartItem) => cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem) : [...current, { ...item, id, quantity: 1 }];
  });
  const changeQuantity = (id: string, amount: number) => setItems((current) => current.flatMap((item) => item.id === id ? [{ ...item, quantity: item.quantity + amount }].filter((next) => next.quantity > 0) : [item]));
  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  return <CartContext.Provider value={{ items, addItem, changeQuantity, removeItem, clearCart, subtotal, count, cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false) }}>{children}</CartContext.Provider>;
}

function ImageWithFallback({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`image-fallback ${className}`} aria-label={`${alt} unavailable`}><ForkKnife size={22} /></div>;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, cartOpen, openCart, closeCart } = useCart();
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);
  return <div className="site-shell"><header className="navbar"><Link className="brand" to="/">Ventose <span>Cafe</span></Link><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><span /><span /><span /></button><nav className={menuOpen ? 'nav-links open' : 'nav-links'}>{navLinks.map((link) => <NavLink key={link.path} to={link.path} end={link.path === '/'} className={({ isActive }) => isActive ? 'active' : ''}>{link.label}</NavLink>)}<button className="cart-link" onClick={openCart} aria-label="Cart"><ShoppingBag size={17} /><span className="cart-badge">{count}</span></button></nav></header><main>{children}</main><Footer />{cartOpen && <CartErrorBoundary onClose={closeCart}><CartDrawer onClose={closeCart} /></CartErrorBoundary>}</div>;
}

function Footer() {
  return <footer><Link className="brand" to="/">Ventose <span>Cafe</span></Link><p className="footer-contact">Shaheed Chowk, Timergara · <a href="tel:03441785831">03441785831</a></p><p>© Ventose Cafe</p><Link className="footer-top" to="/">Back to top <ArrowRight size={15} /></Link></footer>;
}

function PageHero({ eyebrow, title, image }: { eyebrow: string; title: ReactNode; image: string }) {
  return <section className="page-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5,5,5,.82), rgba(5,5,5,.48)), url(${image})` }}><div className="hero-grid" /><div className="page-hero-content"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div></section>;
}

function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.16 }); observer.observe(node); return () => observer.disconnect(); }, []);
  return { ref, visible };
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => { if (!active) return; let current = 0; const timer = window.setInterval(() => { current += Math.max(1, Math.ceil(target / 26)); if (current >= target) { setValue(target); window.clearInterval(timer); } else setValue(current); }, 42); return () => window.clearInterval(timer); }, [active, target]);
  return value;
}

function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [heroIndex, setHeroIndex] = useState(0);
  const trainPizza = menuCategories.find((category) => category.id === 'pizzas')?.items.find((item) => item.name === 'Ventose Train Pizza');
  const signatureNames = ['Ventose Train Pizza', 'Ventose Special Steak', 'Ventose Special Pizza', 'Smashed Beef Burger (Double Patty)', 'Ventose Special Honey Glaze Wings', 'Pistachio Pesto Pasta'];
  const signatures = signatureNames.map((name) => menuCategories.flatMap((category) => category.items).find((item) => item.name === name)).filter((item): item is MenuItem => Boolean(item));
  const signatureReveal = useRevealOnScroll();
  const experienceReveal = useRevealOnScroll();
  const galleryReveal = useRevealOnScroll();
  const visitReveal = useRevealOnScroll();
  const dishesCount = useCountUp(50, experienceReveal.visible);
  const pizzaLength = useCountUp(1, experienceReveal.visible);
  const openDays = useCountUp(7, experienceReveal.visible);
  useEffect(() => { const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % cafeImages.length), 6500); return () => window.clearInterval(timer); }, []);
  return <>
    <section className="home-hero" aria-label="Ventose Cafe introduction"><div className="hero-slides">{cafeImages.map((image, index) => <div className={`hero-slide ${heroIndex === index ? 'is-active' : ''}`} key={image.src} style={{ backgroundImage: `linear-gradient(90deg, rgba(5,5,5,.72), rgba(5,5,5,.54)), url(${image.src})` }} />)}</div><div className="home-jali" /><div className="home-particles" aria-hidden="true"><i /><i /><i /><i /><i /></div><div className="hero-content home-hero-content reveal"><div className="home-kicker"><span /><ForkKnife size={14} /><span /><small>EST. TIMERGARA</small></div><h1><span>Ventose</span> <em>Cafe</em></h1><p className="hero-tagline">Taste the <span>Experience</span></p><div className="hero-led-line" /><div className="hero-actions"><Link className="gold-button" to="/menu">View Menu <ArrowDown size={19} /></Link><button className="outline-button" onClick={() => { if (trainPizza) addItem({ name: trainPizza.name, image: trainPizza.image, size: '1 meter', price: trainPizza.prices?.small ?? 3699 }); navigate('/cart'); }}>Order Now <ShoppingBag size={17} /></button></div></div><div className="hero-dots">{cafeImages.map((image, index) => <button key={image.src} className={heroIndex === index ? 'active' : ''} onClick={() => setHeroIndex(index)} aria-label={`Show cafe photo ${index + 1}`} />)}</div><div className="home-scroll-cue"><span /><small>SCROLL TO EXPLORE</small></div></section>
    <section ref={signatureReveal.ref} className={`home-section signature-section section-pad home-reveal ${signatureReveal.visible ? 'is-visible' : ''}`}><div className="section-heading"><div><p className="eyebrow">FROM OUR KITCHEN</p><h2>Signatures worth <em>sharing.</em></h2></div><p className="heading-note">A few favourites, made<br />to start a conversation.</p></div><div className="signature-row">{signatures.map((item, index) => <Link className="signature-card arch-frame" to={`/menu#${item.name.includes('Pizza') ? 'pizzas' : item.name.includes('Steak') ? 'steaks' : item.name.includes('Pasta') ? 'pastas-salads' : item.name.includes('Wings') || item.name.includes('Burger') ? 'fast-food' : 'fast-food'}`} style={{ '--delay': `${index * 70}ms` } as CSSProperties} key={item.name}><ImageWithFallback src={item.image} alt={item.name} /><div className="signature-shade" /><span className="signature-badge">{index === 0 ? 'Must Try' : 'Signature'}</span><div className="signature-info"><strong>{item.name}</strong><b>Rs. {item.prices?.small ?? item.price}</b></div></Link>)}</div><Link className="text-link centered-link" to="/menu">View full menu <ArrowRight size={17} /></Link></section>
    <section className="home-section home-categories section-pad section-dark"><div className="section-heading"><div><p className="eyebrow">CHOOSE YOUR CRAVING</p><h2>Made for <em>gathering.</em></h2></div><p className="heading-note">Six ways to find<br />your next favourite.</p></div><div className="category-tiles">{categoryTiles.map((tile) => <Link className="category-tile arch-frame" to={`/menu#${tile.id}`} key={tile.label}><ImageWithFallback src={tile.image} alt={tile.label} /><span>{tile.label}</span><ArrowRight size={16} /></Link>)}</div></section>
    <section ref={experienceReveal.ref} className={`home-section experience-section section-pad home-reveal ${experienceReveal.visible ? 'is-visible' : ''}`}><div className="experience-image-wrap"><div className="experience-glow" /><div className="experience-image arch-frame"><ImageWithFallback src={cafeImages[0].src} alt="Ventose Cafe dining room" /></div></div><div className="experience-copy"><p className="eyebrow">THE EXPERIENCE</p><h2>Black marble.<br /><em>Golden light.</em><br />Unforgettable taste.</h2><div className="gold-rule" /><p>Come for the glow, stay for the table. Ventose Cafe is designed around the moments that turn a meal into a memory.</p><Link className="outline-button" to="/about">Our Story <ArrowRight size={16} /></Link><div className="counter-row"><div><strong>{dishesCount}<sup>+</sup></strong><span>Dishes</span></div><div><strong>{pizzaLength}<sup>m</sup></strong><span>Pizza</span></div><div><strong>{openDays}</strong><span>Open daily</span></div></div></div></section>
    {trainPizza && <section className="home-section train-banner section-pad"><div className="train-banner-inner" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,7,7,.9), rgba(7,7,7,.38)), url(${trainPizza.image})` }}><div><p className="eyebrow">THE TABLE-SIZED SIGNATURE</p><h2>The Ventose <em>Train.</em></h2><p>One meter. Different flavours. One unforgettable centrepiece.</p><button className="gold-button" onClick={() => { addItem({ name: trainPizza.name, image: trainPizza.image, size: '1 meter', price: trainPizza.prices?.small ?? 3699 }); navigate('/cart'); }}>Order Now <ShoppingBag size={17} /></button></div><span className="train-badge">1 METRE<br /><small>OF GOOD TIMES</small></span></div></section>}
    <section ref={galleryReveal.ref} className={`home-section home-gallery-preview section-pad home-reveal ${galleryReveal.visible ? 'is-visible' : ''}`}><div className="section-heading"><div><p className="eyebrow">A PLACE TO GATHER</p><h2>Inside <em>Ventose.</em></h2></div><Link className="text-link" to="/gallery">View gallery <ArrowRight size={17} /></Link></div><div className="home-gallery-grid">{cafeImages.map((image, index) => <Link to="/gallery" className="home-gallery-card arch-frame" key={image.src}><ImageWithFallback src={image.src} alt={image.title} /><span>0{index + 1}</span></Link>)}</div></section>
    <section ref={visitReveal.ref} className={`visit-strip home-reveal ${visitReveal.visible ? 'is-visible' : ''}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(5,5,5,.88), rgba(5,5,5,.62)), url(${cafeImages[1].src})` }}><div><p className="eyebrow">COME SAY HELLO</p><h2>Pull up a <em>yellow chair.</em></h2></div><div className="visit-details"><span><MapPin size={17} />Shaheed Chowk, Timergara</span><a href="tel:03441785831"><Phone size={17} />03441785831</a><span><Clock3 size={17} />Mon – Sun · 12 PM – 12 AM</span></div><Link className="gold-button" to="/cart">Order Now <ArrowRight size={16} /></Link></section>
  </>;
}

function DishPopup({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { addItem, openCart } = useCart();
  const sizes = item.prices ? Object.entries(item.prices).filter((entry): entry is [string, number] => typeof entry[1] === 'number') : [];
  const [size, setSize] = useState(sizes[0]?.[0] ?? 'standard');
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const price = item.prices ? item.prices[size as keyof NonNullable<MenuItem['prices']>] ?? sizes[0]?.[1] ?? 0 : item.price ?? 0;
  const displaySize = size === 'standard' ? undefined : size[0].toUpperCase() + size.slice(1);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [onClose]);
  const orderDish = () => { for (let index = 0; index < quantity; index += 1) addItem({ name: item.name, image: item.image, size: displaySize, price }); onClose(); setTimeout(openCart, 50); };
  return <div className="dish-popup-backdrop" role="dialog" aria-modal="true" onClick={onClose}><div className="dish-popup" onClick={(event) => event.stopPropagation()}><button className="popup-close" onClick={onClose} aria-label="Close dish preview"><X size={19} /></button><div className="popup-image-wrap"><ImageWithFallback src={item.image} alt={item.name} className="popup-image" /></div><div className="popup-details"><div className="popup-heading"><div><p className="eyebrow">FROM THE VENTOSE KITCHEN</p><h2>{item.name}</h2></div><button className={favorite ? 'favorite-button selected' : 'favorite-button'} onClick={() => setFavorite(!favorite)} aria-label={favorite ? 'Remove favorite' : 'Add favorite'}><Heart size={19} fill={favorite ? 'currentColor' : 'none'} /></button></div><p className="popup-description">{item.description ?? 'A Ventose favourite, prepared with generous flavour and served fresh to your table.'}</p>{sizes.length > 0 && <div className="popup-sizes"><span>Choose size</span><div>{sizes.map(([key, value]) => <button className={key === size ? 'selected' : ''} key={key} onClick={() => setSize(key)}>{key[0].toUpperCase() + key.slice(1)}<small>Rs. {value}</small></button>)}</div></div>}<div className="popup-bottom"><div className="popup-quantity"><button onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><strong>{quantity}</strong><button onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div><strong className="popup-price">Rs. {price * quantity}</strong></div><button className="gold-button popup-order" onClick={orderDish}>Order <ShoppingBag size={17} /></button></div></div></div>;
}

function MenuItemCard({ item, isPizza = false, onOpen }: { item: MenuItem; isPizza?: boolean; onOpen: (item: MenuItem) => void }) {
  const price = item.prices?.small ?? item.price ?? 0;
  return <div className={isPizza ? 'menu-pizza-card' : 'menu-item-card'}><button className="dish-hit dish-image-hit" onClick={() => onOpen(item)} aria-label={`View ${item.name}`}><ImageWithFallback src={item.image} alt={item.name} className="menu-thumb" /></button><div className="menu-card-content"><button className="dish-hit dish-name-hit" onClick={() => onOpen(item)}><strong>{item.name}</strong>{item.description && <small>{item.description}</small>}</button><div className="menu-price-line"><span /><b>Rs. {price}</b></div>{isPizza && <span className="pizza-size-hint">4 sizes in preview</span>}<button className="add-button" onClick={() => onOpen(item)}><ShoppingBag size={13} /> Order</button></div></div>;
}

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  useEffect(() => { const hash = window.location.hash.replace('#', ''); if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 50); }, []);
  return <><PageHero eyebrow="MADE TO BE SHARED" title={<>The <em>Menu</em></>} image={cafeImages[2].src} /><section className="menu-section page-pad"><div className="category-nav">{menuCategories.map((category) => <a href={`#${category.id}`} className={activeCategory === category.id ? 'active' : ''} key={category.id} onClick={() => setActiveCategory(category.id)}>{category.label}</a>)}</div><div className="menu-list">{menuCategories.map((category) => <section key={category.id} id={category.id} className="menu-category" onMouseEnter={() => setActiveCategory(category.id)}><div className="category-title"><h3>{category.title}</h3>{category.note && <span>{category.note}</span>}<div className="gold-rule" /></div>{category.id === 'pizzas' && <div className="pizza-size-heading"><span>Choose a size inside the preview</span><span>Small · Medium · Large · Family</span></div>}<div className="menu-items">{category.items.map((item) => <MenuItemCard item={item} isPizza={category.id === 'pizzas'} onOpen={setSelectedItem} key={item.name} />)}</div></section>)}</div><div className="cold-drinks"><div className="category-title"><h3>Cold Beverages</h3><div className="gold-rule" /></div><div className="cold-grid">{coldDrinks.map((drink) => <div key={drink}><span className="drink-icon"><ForkKnife size={14} /></span>{drink}</div>)}</div></div></section>{selectedItem && <DishPopup item={selectedItem} onClose={() => setSelectedItem(null)} />}</>;
}

function AboutPage() {
  return <><PageHero eyebrow="THE VENTOSE STORY" title={<>Designed for the <em>good times.</em></>} image={cafeImages[0].src} /><section className="about-page section-pad"><div className="about-page-copy"><p className="eyebrow">A TABLE WITH A POINT OF VIEW</p><h2>Where every detail is made to <em>linger.</em></h2><div className="gold-rule" /><p>Ventose Cafe is a warm, stylish space built around good food and even better company. Step inside black marble, glowing golden lattice, arch-shaped lights and the unmistakable energy of yellow and black chairs.</p><p>Our menu moves from oven-fresh pizzas and flame-kissed steaks to Chinese, Thai, fast food and refreshing drinks, bringing something for every craving to the table.</p><Link className="gold-button" to="/menu">Explore the menu <ArrowRight size={17} /></Link></div><div className="about-page-image arch-frame"><ImageWithFallback src={cafeImages[3].src} alt="Ventose Cafe interior" /></div></section></>;
}

function GalleryPage() {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const [index, setIndex] = useState(0);
  const open = (nextIndex: number) => { setIndex(nextIndex); setLightbox(cafeImages[nextIndex]); };
  const move = (amount: number) => { const next = (index + amount + cafeImages.length) % cafeImages.length; setIndex(next); setLightbox(cafeImages[next]); };
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setLightbox(null); if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); });
  return <><PageHero eyebrow="A PLACE TO GATHER" title={<>Our <em>Cafe</em></>} image={cafeImages[1].src} /><section className="gallery-section page-pad section-dark"><div className="section-heading"><div><p className="eyebrow">LIGHT, SHADOW & GOLD</p><h2>Every corner has a <em>story.</em></h2></div></div><div className="gallery-grid">{cafeImages.map((image, imageIndex) => <button className="gallery-card arch-frame" key={image.src} onClick={() => open(imageIndex)}><ImageWithFallback src={image.src} alt={image.title} /><span>{String(imageIndex + 1).padStart(2, '0')} / {image.title}</span></button>)}</div></section>{lightbox && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close preview"><X /></button><button className="lightbox-arrow left" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Previous photo"><ArrowLeft /></button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}><ImageWithFallback src={lightbox.src} alt={lightbox.title} className="lightbox-image" /><h3>{lightbox.title}</h3></div><button className="lightbox-arrow right" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Next photo"><ArrowRight /></button></div>}</>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); event.currentTarget.reset(); };
  return <><PageHero eyebrow="COME SAY HELLO" title={<>Visit <em>Us</em></>} image={cafeImages[1].src} /><section className="contact-page section-pad"><div className="contact-page-info"><p className="contact-intro">Pull up a yellow chair. Stay for one more plate.</p><div className="contact-details"><div><MapPin size={20} /><p><strong>Find us</strong>Shaheed Chowk, Timergara</p></div><div><Phone size={20} /><p><strong>Call us</strong><a href="tel:03441785831">03441785831</a></p></div><div><Clock3 size={20} /><p><strong>Opening hours</strong>Mon – Sun · 12:00 PM – 12:00 AM</p></div></div><div className="socials"><a href="#contact" aria-label="Instagram"><Instagram size={19} /></a><a href="#contact" aria-label="Facebook"><Facebook size={19} /></a></div></div><form className="contact-form" onSubmit={submit}><p className="eyebrow">SEND A NOTE</p><h2>We would love to <em>hear from you.</em></h2><label>Name<input name="name" required placeholder="Your name" /></label><label>Phone<input name="phone" required type="tel" placeholder="Your phone number" /></label><label>Message<textarea name="message" required placeholder="How can we help?" rows={4} /></label><button className="gold-button" type="submit">{sent ? <>Message sent <Check size={16} /></> : <>Send message <ArrowRight size={16} /></>}</button></form></section></>;
}

class CartErrorBoundary extends Component<{ onClose: () => void; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() { document.body.style.overflow = ''; }
  render() { if (this.state.hasError) return <div className="cart-drawer-layer"><button className="cart-drawer-scrim" onClick={this.props.onClose} tabIndex={-1} /><aside className="cart-drawer"><div className="drawer-confirmed"><div className="confirmation-icon"><X /></div><p className="eyebrow">SOMETHING WENT WRONG</p><h2>Please try again</h2><p>An error occurred while loading the cart. Close and try ordering again.</p><button className="gold-button" onClick={this.props.onClose}>Close <X size={16} /></button></div></aside></div>; return this.props.children; }
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, changeQuantity, removeItem, subtotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState('Dine-in');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<{ number: string; name: string; total: number } | null>(null);
  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    if (!items.length) { setError('Your cart is empty. Add something delicious first.'); return; }
    const data = new FormData(event.currentTarget); const name = String(data.get('name') ?? '').trim(); const phone = String(data.get('phone') ?? '').trim(); const table = String(data.get('table') ?? '').trim(); const address = String(data.get('address') ?? '').trim(); const instructions = String(data.get('instructions') ?? '').trim();
    if (!name || !phone || (orderType === 'Dine-in' && !table) || (orderType === 'Delivery' && !address)) { setError('Please complete the required order details.'); return; }
    const orderNumber = `VC-${Date.now().toString().slice(-6)}`; const lines = items.map((item) => `• ${item.name}${item.size ? ` (${item.size})` : ''} × ${item.quantity} — Rs. ${item.price * item.quantity}`).join('\\n'); const destination = orderType === 'Dine-in' ? `Table: ${table}` : orderType === 'Delivery' ? `Address: ${address}` : 'Takeaway'; const message = `Ventose Cafe Order ${orderNumber}\\nName: ${name}\\nPhone: ${phone}\\nOrder type: ${orderType}\\n${destination}\\n\\n${lines}\\n\\nTotal: Rs. ${subtotal}${instructions ? `\\nSpecial instructions: ${instructions}` : ''}`; window.open(`https://wa.me/923441785831?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); clearCart(); setConfirmed({ number: orderNumber, name, total: subtotal });
  };
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [onClose]);
  return <div className="cart-drawer-layer" role="dialog" aria-modal="true"><button className="cart-drawer-scrim" onClick={onClose} aria-label="Close cart" tabIndex={-1} /><aside className="cart-drawer">{confirmed ? <div className="drawer-confirmed"><div className="confirmation-icon"><Check /></div><p className="eyebrow">ORDER CONFIRMED</p><h2>{confirmed.number}</h2><p>Thanks, {confirmed.name}. Your order has been sent to the Ventose Cafe team.</p><strong>Rs. {confirmed.total}</strong><button className="gold-button" onClick={onClose}>Continue browsing <ArrowRight size={16} /></button></div> : <><div className="drawer-header"><div><p className="eyebrow">YOUR TABLE, YOUR WAY</p><h2>Your <em>Cart</em></h2></div><button className="popup-close" onClick={onClose} aria-label="Close cart"><X /></button></div><div className="drawer-scroll"><div className="drawer-items">{!items.length ? <div className="empty-cart"><ShoppingBag size={30} /><p>Your cart is waiting for something good.</p><Link className="text-link" to="/menu" onClick={onClose}>Browse the menu <ArrowRight size={16} /></Link></div> : items.map((item) => <div className="drawer-item" key={item.id}><ImageWithFallback src={item.image} alt={item.name} className="cart-thumb" /><div><strong>{item.name}</strong><small>{item.size ?? 'Standard'} · Rs. {item.price}</small><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><b>Rs. {item.price * item.quantity}</b><button className="remove-item" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button></div>)}</div><form className="drawer-checkout" onSubmit={placeOrder}><h3>Checkout</h3><label>Name<input name="name" required placeholder="Your name" /></label><label>Phone<input name="phone" required type="tel" placeholder="03441785831" /></label><label>Order type<select name="orderType" value={orderType} onChange={(event) => setOrderType(event.target.value)}><option>Dine-in</option><option>Takeaway</option><option>Delivery</option></select></label>{orderType === 'Dine-in' && <label>Table number<input name="table" required placeholder="Table number" /></label>}{orderType === 'Delivery' && <label>Delivery address<textarea name="address" required rows={2} placeholder="Where should we deliver?" /></label>}<label>Special instructions<textarea name="instructions" rows={2} placeholder="Anything we should know?" /></label><div className="total-line"><span>Total</span><b>Rs. {subtotal}</b></div>{error && <p className="form-error">{error}</p>}<button className="gold-button" type="submit">Place Order <ArrowRight size={16} /></button></form><Link className="drawer-full-cart" to="/cart" onClick={onClose}>Open full cart page</Link></div></>}</aside></div>;
}

function CartPage() {
  const { items, changeQuantity, removeItem, subtotal, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState<{ number: string; name: string; total: number } | null>(null);
  const [orderType, setOrderType] = useState('Dine-in');
  const [error, setError] = useState('');
  const total = subtotal;
  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    if (!items.length) { setError('Your cart is empty. Add something delicious first.'); return; }
    const data = new FormData(event.currentTarget); const name = String(data.get('name') ?? '').trim(); const phone = String(data.get('phone') ?? '').trim(); const table = String(data.get('table') ?? '').trim(); const address = String(data.get('address') ?? '').trim(); const instructions = String(data.get('instructions') ?? '').trim();
    if (!name || !phone || (orderType === 'Dine-in' && !table) || (orderType === 'Delivery' && !address)) { setError('Please complete the required order details.'); return; }
    const orderNumber = `VC-${Date.now().toString().slice(-6)}`; const lines = items.map((item) => `• ${item.name}${item.size ? ` (${item.size})` : ''} × ${item.quantity} — Rs. ${item.price * item.quantity}`).join('\n'); const destination = orderType === 'Dine-in' ? `Table: ${table}` : orderType === 'Delivery' ? `Address: ${address}` : 'Takeaway'; const message = `Ventose Cafe Order ${orderNumber}\nName: ${name}\nPhone: ${phone}\nOrder type: ${orderType}\n${destination}\n\n${lines}\n\nTotal: Rs. ${total}${instructions ? `\nSpecial instructions: ${instructions}` : ''}`; window.open(`https://wa.me/923441785831?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); clearCart(); setConfirmed({ number: orderNumber, name, total });
  };
  if (confirmed) return <section className="confirmation page-pad"><div className="confirmation-card"><div className="confirmation-icon"><Check /></div><p className="eyebrow">THANK YOU, {confirmed.name.toUpperCase()}</p><h1>Order <em>Confirmed.</em></h1><p>Your order has been prepared for the Ventose Cafe team.</p><div className="confirmation-meta"><span>Order number<strong>{confirmed.number}</strong></span><span>Total<strong>Rs. {confirmed.total}</strong></span></div><Link className="gold-button" to="/menu">Order something else <ArrowRight size={17} /></Link></div></section>;
  return <section className="cart-page page-pad"><div className="section-heading"><div><p className="eyebrow">YOUR TABLE, YOUR WAY</p><h1>Your <em>Cart</em></h1></div></div><div className="cart-layout"><div className="cart-items"><h2>Order summary</h2>{!items.length ? <div className="empty-cart"><ShoppingBag size={35} /><p>Your cart is waiting for something good.</p><Link className="text-link" to="/menu">Browse the menu <ArrowRight size={17} /></Link></div> : items.map((item) => <div className="cart-item" key={item.id}><ImageWithFallback src={item.image} alt={item.name} className="cart-thumb" /><div><strong>{item.name}</strong><small>{item.size ?? 'Standard'} · Rs. {item.price}</small><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><b>Rs. {item.price * item.quantity}</b><button className="remove-item" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button></div>)}</div><form className="checkout-card" onSubmit={placeOrder}><h2>Checkout</h2><label>Name<input name="name" required placeholder="Your name" /></label><label>Phone number<input name="phone" required type="tel" placeholder="03441785831" /></label><label>Order type<select name="orderType" value={orderType} onChange={(event) => setOrderType(event.target.value)}><option>Dine-in</option><option>Takeaway</option><option>Delivery</option></select></label>{orderType === 'Dine-in' && <label>Table number<input name="table" required placeholder="Table number" /></label>}{orderType === 'Delivery' && <label>Delivery address<textarea name="address" required rows={3} placeholder="Where should we deliver?" /></label>}<label>Special instructions<textarea name="instructions" rows={3} placeholder="Anything we should know?" /></label><div className="total-line"><span>Subtotal</span><b>Rs. {subtotal}</b></div>{error && <p className="form-error">{error}</p>}<button className="gold-button" type="submit">Place Order <ArrowRight size={16} /></button><small className="whatsapp-note">Your order will open in WhatsApp for confirmation.</small></form></div></section>;
}

function App() {
  return <BrowserRouter><CartProvider><Layout><Routes><Route path="/" element={<HomePage />} /><Route path="/menu" element={<MenuPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/gallery" element={<GalleryPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/cart" element={<CartPage />} /></Routes></Layout></CartProvider></BrowserRouter>;
}

export default App;
