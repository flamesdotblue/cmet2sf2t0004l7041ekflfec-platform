import React, { useEffect, useMemo, useState } from "react";

// Utility helpers
const formatCurrency = (num) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(num);
const classNames = (...c) => c.filter(Boolean).join(" ");

// Sample product catalog
const PRODUCTS = [
  {
    id: "1",
    name: "Stride Runner",
    brand: "Airstep",
    category: "Running",
    price: 89.99,
    rating: 4.6,
    reviews: 214,
    colors: ["#000000", "#E11D48", "#2563EB"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    description: "Lightweight running shoes with responsive cushioning for daily miles.",
    stock: 18,
    tags: ["cushioned", "lightweight", "breathable"],
  },
  {
    id: "2",
    name: "Urban Classic",
    brand: "CityWalk",
    category: "Lifestyle",
    price: 74.5,
    rating: 4.3,
    reviews: 132,
    colors: ["#111827", "#F59E0B"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    description: "Timeless streetwear sneaker built for style and all‑day comfort.",
    stock: 25,
    tags: ["casual", "everyday", "versatile"],
  },
  {
    id: "3",
    name: "Trail Hawk GTX",
    brand: "TerraPro",
    category: "Hiking",
    price: 129.0,
    rating: 4.8,
    reviews: 388,
    colors: ["#065F46", "#78350F"],
    image: "https://images.unsplash.com/photo-1542291026-1475f2f2f7e7?q=80&w=1200&auto=format&fit=crop",
    description: "Waterproof trail shoes with rugged grip and rock plate for technical terrain.",
    stock: 12,
    tags: ["waterproof", "grippy", "durable"],
  },
  {
    id: "4",
    name: "Court Ace",
    brand: "Baseline",
    category: "Tennis",
    price: 98.0,
    rating: 4.1,
    reviews: 77,
    colors: ["#FFFFFF", "#10B981"],
    image: "https://images.unsplash.com/photo-1519741498535-0da7085f9f8b?q=80&w=1200&auto=format&fit=crop",
    description: "Stable tennis shoe with reinforced lateral support and herringbone outsole.",
    stock: 7,
    tags: ["stable", "supportive", "court"],
  },
  {
    id: "5",
    name: "Pace Racer Pro",
    brand: "Airstep",
    category: "Running",
    price: 149.99,
    rating: 4.7,
    reviews: 260,
    colors: ["#EF4444", "#111827"],
    image: "https://images.unsplash.com/photo-1543951893-9ab9c9f3ec16?q=80&w=1200&auto=format&fit=crop",
    description: "Carbon‑infused plate for race‑day efficiency and snappy transitions.",
    stock: 9,
    tags: ["race", "responsive", "fast"],
  },
  {
    id: "6",
    name: "Studio Flow",
    brand: "Balance+",
    category: "Training",
    price: 69.0,
    rating: 4.0,
    reviews: 55,
    colors: ["#6B7280", "#1F2937"],
    image: "https://images.unsplash.com/photo-1519741500055-44f6ee2f2b5a?q=80&w=1200&auto=format&fit=crop",
    description: "Cross‑trainer with wide base and flexible forefoot for gym sessions.",
    stock: 30,
    tags: ["gym", "cross‑training", "stable"],
  },
  {
    id: "7",
    name: "Coast Slide",
    brand: "Seabreeze",
    category: "Sandals",
    price: 29.99,
    rating: 4.2,
    reviews: 301,
    colors: ["#0EA5E9", "#F97316"],
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1200&auto=format&fit=crop",
    description: "Comfy slides with contoured footbed ideal for recovery and beach.",
    stock: 40,
    tags: ["recovery", "water‑friendly", "light"],
  },
  {
    id: "8",
    name: "Peak Climber",
    brand: "TerraPro",
    category: "Hiking",
    price: 119.5,
    rating: 4.4,
    reviews: 98,
    colors: ["#1F2937", "#9CA3AF"],
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",
    description: "All‑terrain hiking shoe with toe bumper and trail‑ready traction.",
    stock: 16,
    tags: ["trail", "protective", "all‑terrain"],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
const BRANDS = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.brand)))];

function StarRating({ value }) {
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const fill = value - i;
    const full = fill >= 1;
    const half = fill > 0 && fill < 1;
    return (
      <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`half-${i}`} x1="0" y1="0" x2="20" y2="0">
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path
          d="M10 1.5l2.588 5.244 5.788.84-4.188 4.085.988 5.762L10 15.9l-5.176 2.531.988-5.762L1.624 7.584l5.788-.84L10 1.5z"
          fill={full ? "#F59E0B" : half ? `url(#half-${i})` : "#D1D5DB"}
        />
      </svg>
    );
  });
  return <div className="flex items-center gap-1">{stars}</div>;
}

function Badge({ children }) {
  return <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{children}</span>;
}

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (brand !== "All") list = list.filter((p) => p.brand === brand);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [category, brand, query, sort]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function addToCart(product, color) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.color === color);
      const available = product.stock;
      if (idx >= 0) {
        const copy = [...prev];
        const nextQty = Math.min(copy[idx].qty + 1, available);
        copy[idx] = { ...copy[idx], qty: nextQty };
        return copy;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, color, image: product.image, qty: 1, stock: available }];
    });
  }

  function updateQty(id, color, delta) {
    setCart((prev) => {
      return prev
        .map((i) => (i.id === id && i.color === color ? { ...i, qty: Math.max(1, Math.min(i.qty + delta, i.stock)) } : i))
        .filter((i) => i.qty > 0);
    });
  }

  function removeItem(id, color) {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.color === color)));
  }

  function clearCart() {
    setCart([]);
  }

  function CheckoutForm({ onClose }) {
    const [form, setForm] = useState({ name: "", email: "", address: "", card: "", agree: false });
    const [errors, setErrors] = useState({});

    function validate() {
      const e = {};
      if (!form.name.trim()) e.name = "Name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
      if (form.address.trim().length < 8) e.address = "Full address required";
      if (!/^\d{16}$/.test(form.card.replace(/\s/g, ""))) e.card = "16‑digit card required";
      if (!form.agree) e.agree = "You must accept terms";
      setErrors(e);
      return Object.keys(e).length === 0;
    }

    function handleSubmit(e) {
      e.preventDefault();
      if (!validate()) return;
      alert("Order placed! This is a demo – no payment processed.");
      clearCart();
      onClose();
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={classNames("w-full rounded-md border px-3 py-2", errors.name ? "border-red-500" : "border-gray-300")} placeholder="Jane Doe" />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={classNames("w-full rounded-md border px-3 py-2", errors.email ? "border-red-500" : "border-gray-300")} placeholder="jane@example.com" />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shipping address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={classNames("w-full rounded-md border px-3 py-2", errors.address ? "border-red-500" : "border-gray-300")} placeholder="123 Main St, City, State" />
          {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Card number</label>
          <input value={form.card} onChange={(e) => setForm({ ...form, card: e.target.value.replace(/[^\d]/g, "").slice(0,16).replace(/(\d{4})/g, "$1 ").trim() })} className={classNames("w-full rounded-md border px-3 py-2", errors.card ? "border-red-500" : "border-gray-300")} placeholder="1234 5678 9012 3456" />
          {errors.card && <p className="text-xs text-red-600 mt-1">{errors.card}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} />
          <span>I agree to the terms and privacy policy</span>
        </label>
        {errors.agree && <p className="text-xs text-red-600 -mt-2">{errors.agree}</p>}
        <button type="submit" className="w-full bg-emerald-600 text-white rounded-md py-2.5 hover:bg-emerald-700">Pay {formatCurrency(subtotal)}</button>
      </form>
    );
  }

  function ProductCard({ p }) {
    const [color, setColor] = useState(p.colors[0]);
    const out = p.stock <= 0;
    return (
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
        <div className="relative aspect-square overflow-hidden">
          <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e)=>{e.currentTarget.src='data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\"><rect width=\"100%\" height=\"100%\" fill=\"#f3f4f6\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"#6b7280\" font-family=\"sans-serif\" font-size=\"24\">Image unavailable</text></svg>`);}} />
          {out && <span className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">Sold out</span>}
          <button onClick={()=>setDetail(p)} className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-gray-900 text-sm px-3 py-1.5 rounded-md shadow hover:bg-white">Quick view</button>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.brand} • {p.category}</p>
            </div>
            <div className="text-right font-semibold">{formatCurrency(p.price)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating value={p.rating} />
              <span className="text-xs text-gray-500">({p.reviews})</span>
            </div>
            <div className="flex -space-x-1">
              {p.colors.map((c) => (
                <button key={c} aria-label={`Color ${c}`} onClick={() => setColor(c)} className={classNames("w-5 h-5 rounded-full border", color === c ? "ring-2 ring-offset-2 ring-emerald-500" : "")} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <button disabled={out} onClick={() => addToCart(p, color)} className={classNames("mt-auto w-full rounded-md py-2.5 font-medium", out ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black")}>{out ? "Out of stock" : "Add to cart"}</button>
        </div>
      </div>
    );
  }

  function CartDrawer() {
    const [checkingOut, setCheckingOut] = useState(false);
    return (
      <div className={classNames("fixed inset-0 z-50", cartOpen ? "" : "pointer-events-none")}> 
        <div className={classNames("absolute inset-0 bg-black/40 transition-opacity", cartOpen ? "opacity-100" : "opacity-0")} onClick={() => setCartOpen(false)} />
        <aside className={classNames("absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 flex flex-col", cartOpen ? "translate-x-0" : "translate-x-full")}> 
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your cart</h2>
            <button onClick={() => setCartOpen(false)} className="p-2 rounded hover:bg-gray-100" aria-label="Close cart">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 && <p className="text-gray-500">Your cart is empty.</p>}
            {cart.map((i) => (
              <div key={i.id + i.color} className="flex gap-3 border rounded-lg p-3">
                <img src={i.image} alt={i.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-gray-500">Color: <span className="align-middle inline-block w-3 h-3 rounded-sm border ml-1" style={{ backgroundColor: i.color }} /></p>
                    </div>
                    <button onClick={() => removeItem(i.id, i.color)} className="text-sm text-gray-500 hover:text-gray-700">Remove</button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border rounded-md">
                      <button className="px-2 py-1" onClick={() => updateQty(i.id, i.color, -1)}>-</button>
                      <span className="px-3 select-none">{i.qty}</span>
                      <button className="px-2 py-1" onClick={() => updateQty(i.id, i.color, +1)}>+</button>
                    </div>
                    <div className="font-semibold">{formatCurrency(i.price * i.qty)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500">Taxes and shipping calculated at checkout.</p>
            <div className="flex gap-2">
              <button className="flex-1 border rounded-md py-2 hover:bg-gray-50" onClick={clearCart} disabled={cart.length===0}>Clear</button>
              <button className="flex-1 bg-emerald-600 text-white rounded-md py-2 hover:bg-emerald-700 disabled:opacity-50" disabled={cart.length===0} onClick={()=>setCheckingOut(true)}>Checkout</button>
            </div>
            {checkingOut && (
              <div className="mt-2 border-t pt-4">
                <CheckoutForm onClose={()=>{setCheckingOut(false); setCartOpen(false);}} />
              </div>
            )}
          </div>
        </aside>
      </div>
    );
  }

  function DetailModal() {
    const p = detail;
    const [color, setColor] = useState(p?.colors?.[0] || "#000000");
    if (!p) return null;
    const out = p.stock <= 0;
    return (
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/40" onClick={() => setDetail(null)} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <img src={p.image} alt={p.name} className="h-72 md:h-full w-full object-cover" />
              {out && <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs px-2 py-1 rounded">Sold out</span>}
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.brand} • {p.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={p.rating} />
                <span className="text-xs text-gray-500">{p.rating.toFixed(1)} • {p.reviews} reviews</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{p.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Color</span>
                <div className="flex gap-2">
                  {p.colors.map((c) => (
                    <button key={c} onClick={() => setColor(c)} className={classNames("w-7 h-7 rounded-full border", color === c ? "ring-2 ring-offset-2 ring-emerald-500" : "")} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="text-2xl font-semibold">{formatCurrency(p.price)}</div>
                <div className="flex gap-2">
                  <button onClick={() => setDetail(null)} className="border rounded-md px-4 py-2 hover:bg-gray-50">Close</button>
                  <button disabled={out} onClick={() => addToCart(p, color)} className={classNames("bg-gray-900 text-white rounded-md px-5 py-2 hover:bg-black", out && "opacity-50 cursor-not-allowed")}>Add to cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">S</div>
            <div>
              <p className="font-semibold leading-none">Stepwise</p>
              <p className="text-xs text-gray-500 leading-none">Shoes for every move</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search shoes, brands, tags..." className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setCartOpen(true)} className="relative border rounded-md px-3 py-2 hover:bg-gray-50">
              🛒
              {cart.length>0 && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cart.reduce((s,i)=>s+i.qty,0)}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Find your perfect pair</h1>
            <p className="mt-3 text-gray-600 max-w-prose">From daily jogs to mountain trails to city streets, we craft shoes that match your pace. Free returns for 30 days.</p>
            <div className="mt-6 flex gap-3">
              <a href="#shop" className="bg-gray-900 text-white px-5 py-3 rounded-md hover:bg-black">Shop now</a>
              <button onClick={()=>{setCategory("Running"); window.location.hash = "shop";}} className="border px-5 py-3 rounded-md hover:bg-gray-50">Best for Running</button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-emerald-200 via-white to-emerald-100 border flex items-center justify-center">
              <div className="p-6 text-center">
                <div className="text-7xl">👟</div>
                <p className="mt-3 font-medium">Engineered comfort</p>
                <p className="text-sm text-gray-500">Lightweight foams • Breathable uppers • Reliable traction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section id="shop" className="border-t bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          <div className="flex-1 md:hidden">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search shoes, brands, tags..." className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Category</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="border rounded-md px-3 py-2 bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Brand</label>
            <select value={brand} onChange={(e)=>setBrand(e.target.value)} className="border rounded-md px-3 py-2 bg-white">
              {BRANDS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Sort</label>
            <select value={sort} onChange={(e)=>setSort(e.target.value)} className="border rounded-md px-3 py-2 bg-white">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-500">{filtered.length} results</div>
        </div>
      </section>

      {/* Product grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold">No results</p>
            <p className="text-gray-500">Try adjusting filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/70">
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold">Stepwise</div>
            <p className="text-gray-500 mt-2 max-w-xs">We design footwear that keeps you moving comfortably. Free shipping $50+.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Support</div>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Returns</a></li>
              <li><a href="#" className="hover:underline">Size guide</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Get updates</div>
            <div className="flex gap-2">
              <input placeholder="Email address" className="flex-1 border rounded-md px-3 py-2" />
              <button className="bg-gray-900 text-white px-4 rounded-md">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t text-xs text-gray-500 py-3 text-center">© {new Date().getFullYear()} Stepwise. All rights reserved.</div>
      </footer>

      <CartDrawer />
      {detail && <DetailModal />}
    </div>
  );
}

export default App;
