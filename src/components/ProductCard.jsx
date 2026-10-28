
import { useState } from "react";

function ProductCard({
  name,
  price,
  stock,
  image,
  category,
  onAddToCart,
}) {
  // Favorite button
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if car is sold out
  const soldOut = stock === 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      {/* Car image */}
      <div className="h-48 bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">

        {/* Category and favorite */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {category}
          </span>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            className={`text-2xl ${
              isFavorite ? "text-rose-500" : "text-gray-400"
            }`}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>

        {/* Car name */}
        <h3 className="mt-4 min-h-12 text-lg font-bold text-gray-800">
          {name}
        </h3>

        {/* Price */}
        <p className="mt-2 text-2xl font-extrabold text-blue-700">
          ${Number(price).toLocaleString()}
        </p>

        {/* Availability */}
        <p className="mt-2 text-sm text-gray-500">
          {soldOut ? "Currently unavailable" : "Available"}
        </p>

        {/* Add to cart */}
        <button
          onClick={() => onAddToCart({ name, price })}
          disabled={soldOut}
          className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {soldOut ? "Sold Out" : "＋ Add to Cart"}
        </button>

      </div>
    </article>
  );
}

export default ProductCard;
