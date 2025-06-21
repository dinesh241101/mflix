
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DownloadPage = () => {
  const { id, linkId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new ads-enabled download page
    if (id && linkId) {
      navigate(`/download-ads/${id}/${linkId}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [id, linkId, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting to download page...</p>
      </div>
    </div>
  );
};

export default DownloadPage;
