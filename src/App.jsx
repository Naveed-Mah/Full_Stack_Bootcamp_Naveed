
import { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import CartItem from "./components/CartItem";
import { Cards } from "./data/Cards";

function App() {
  // Cars from our JSON file
  const [products, setProducts] = useState([]);

  // Shopping cart
  const [cart, setCart] = useState(Cards);

  // Search and category
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load cars when the page opens
  useEffect(() => {
    fetch("https://dummyjson.com/c/6795-f9b2-43e7-8447")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load cars");
        }

        return response.json();
      })
      .then((data) => {
        const carProducts = data.cars.map((car) => ({
          ...car,
          stock: car.available ? 1 : 0,
        }));

        setProducts(carProducts);
      })
      .catch((error) => {
        console.error(error);
        setError("Could not load cars. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Search and category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Count unavailable cars
  const soldOutCount = products.filter(
    (product) => product.stock === 0
  ).length;

  // Cart total and item count
  let total = 0;
  let cartCount = 0;

  cart.forEach((item) => {
    total += Number(item.price) * item.quantity;
    cartCount += item.quantity;
  });

  // Add a car to the cart
  function addToCart(product) {
    const existingItem = cart.find(
      (item) => item.name === product.name
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        onSale: false,
      };

      setCart([...cart, newItem]);
    }
  }

  // Free shipping
  const shippingGoal = 150;
  const remaining = Math.max(0, shippingGoal - total);
  const progress = Math.min(
    (total / shippingGoal) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-extrabold">
              Car<span className="text-cyan-400">Smart.</span>
            </h1>
            <p className="text-sm text-slate-400">
              Find your next car.
            </p>
          </div>

          <a
            href="#cart"
            className="rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-900 hover:bg-cyan-300"
          >
            🛒 Cart ({cartCount})
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}
        <section className="mb-12 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-600 p-8 text-white shadow-lg sm:p-12">
          <p className="mb-3 font-semibold uppercase tracking-widest text-blue-200">
            Welcome to CarSmart
          </p>

          <h2 className="text-3xl font-extrabold sm:text-5xl">
            Find a car you'll love.
          </h2>

          <p className="mt-4 max-w-lg text-blue-100">
            Explore cars and find the right one for you.
          </p>

          <a
            href="#products"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-blue-700 hover:bg-blue-50"
          >
            Explore Cars →
          </a>
        </section>

        {/* Cars */}
        <section id="products" className="scroll-mt-6">

          <div className="mb-6">
            <h2 className="text-3xl font-extrabold">
              Our Cars
            </h2>

            <p className="mt-2 text-slate-500">
              Find your next car.
            </p>

            {/* Search and category */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 sm:max-w-xs"
              >
                <option value="All">All Categories</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Electric">Electric</option>
                <option value="Sports">Sports</option>
                <option value="Hatchback">Hatchback</option>
              </select>

              <input
                type="text"
                placeholder="🔍 Search cars..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:max-w-xs"
              />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <p className="p-10 text-center">
              Loading cars...
            </p>
          ) : error ? (
            <p className="p-10 text-center text-red-600">
              {error}
            </p>
          ) : (
            <>
              <p className="mb-5 text-sm text-slate-500">
                {filteredProducts.length} cars · {soldOutCount} unavailable
              </p>

              {/* No cars found */}
              {filteredProducts.length === 0 ? (
                <p className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
                  No cars found. Try another search.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                  {/* Show car cards */}
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      price={product.price}
                      stock={product.stock}
                      image={product.image}
                      category={product.category}
                      onAddToCart={addToCart}
                    />
                  ))}

                </div>
              )}
            </>
          )}
        </section>

        {/* Shopping cart */}
        <section
          id="cart"
          className="mt-14 scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold">
                Your Shopping Cart
              </h2>

              <p className="mt-2 text-slate-500">
                Review your selected cars.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-4 py-2 font-bold text-blue-700">
              {cartCount} items
            </span>
          </div>

          {cart.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
              Your cart is empty. Start exploring!
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="py-4">
                  <CartItem
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    onSale={item.onSale}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Order total */}
          <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg text-slate-300">
                Order Total
              </span>

              <span className="text-3xl font-extrabold">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="mt-5">
              {remaining === 0 ? (
                <p className="font-semibold text-emerald-300">
                  🎉 Free shipping unlocked!
                </p>
              ) : (
                <>
                  <p className="text-sm text-slate-300">
                    Spend ${remaining.toFixed(2)} more for free shipping.
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 px-6 py-8 text-center text-slate-400">
        <p className="text-lg font-bold text-white">
          CarSmart.
        </p>

        <p className="mt-2 text-sm">
          Made with React by Naveed
        </p>
      </footer>
    </div>
  );
}

export default App;
