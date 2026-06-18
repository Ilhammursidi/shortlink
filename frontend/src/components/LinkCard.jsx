import { toast } from "sonner";

// Terima onDelete sebagai props dari DashboardPage
const LinkCard = ({ link, onDelete }) => {
  
  const handleCopy = () => {
    // Gunakan short_url atau sesuaikan dengan field biner data Anda
    navigator.clipboard.writeText(link.short_url || `http://shortlink:8080/${link.slug}`);
    toast.success("Link berhasil disalin!");
  }; // <--- Tanda penutup ini sebelumnya hilang/lupa ditulis

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4 overflow-hidden">
          {/* Pembatasan kata agar tidak meluap keluar batas */}
          <p className="text-sm text-gray-500 break-all">{link.original_url}</p>
          <a
            href={link.short_url || `http://shortlink:8080/${link.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 font-medium hover:underline break-all"
          >
            {link.short_url || `http://shortlink:8080/${link.slug}`}
          </a>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(link.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium transition"
          >
            Copy
          </button>
          <button
            // Panggil fungsi onDelete yang dioper dari komponen induk (Dashboard)
            onClick={() => onDelete(link.id, link.slug)}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
