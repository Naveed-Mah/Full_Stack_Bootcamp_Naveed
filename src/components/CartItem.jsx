
function CartItem({ name, price, quantity, onSale }) {
  // Calculate the price for this item
  const lineTotal = Number(price) * quantity;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">

      {/* Car name */}
      <div>
        <p className="font-bold">{name}</p>

        <p className="text-sm text-gray-500">
          Quantity: {quantity}
        </p>

        {onSale && (
          <p className="text-sm text-green-600">
            On Sale
          </p>
        )}
      </div>

      {/* Total price */}
      <p className="font-bold">
        ${lineTotal.toFixed(2)}
      </p>

    </div>
  );
}

export default CartItem;
