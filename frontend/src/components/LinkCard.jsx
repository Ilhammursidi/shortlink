const LinkCard = ({ link }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link.short_url);
    alert("Link copied!");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <p className="text-sm text-gray-500 truncate">{link.original_url}</p>
          <a
            href={link.short_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 font-medium hover:underline"
          >
            {link.short_url}
          </a>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(link.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default LinkCard;