export default function BestSellerCard({ product }) {
  if (!product)
    return (
      <div className="bg-white p-6 rounded-xl border shadow">
        <p className="text-gray-500">Best Seller</p>
        <p className="font-bold mt-2">—</p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl border shadow">
      <p className="text-gray-500">Best Seller</p>
      <p className="font-bold text-lg mt-2">{product[0]}</p>
      <p className="text-sm text-gray-500">{product[1]} sold</p>
    </div>
  );
}
