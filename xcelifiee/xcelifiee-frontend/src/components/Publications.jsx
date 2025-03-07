import { useState, useEffect } from 'react';

const Publications= () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [formValues, setFormValues] = useState({
    username: "",
    typeOfPublication: "",
    nameOfJournal: "",
    titleOfPaper: "",
    dateOfPublication: "",
    indexing: "",
    authorPosition: "",
    linkForProof: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);

    if (user) {
      setFormValues((prev) => ({
        ...prev,
        username: user.username,
      }));
      fetchPublications(user);
    } else {
      setLoading(false);
      setError("Session expired. Please log in again.");
    }
  }, []);

  const fetchPublications = async (user) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:4000/user-api/publicationsSortTeamData",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();

      const filteredData =
        user?.userType === "admin"
          ? data
          : data.filter((pub) => pub.teamno === user.teamno);

      setPublications(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch publications. Please try again later.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow changing username if admin
    if (name === 'username' && currentUser?.userType !== 'admin') {
      return;
    }
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const required = [
      'username', 'typeOfPublication', 'nameOfJournal', 
      'titleOfPaper', 'dateOfPublication', 'indexing',
      'authorPosition', 'linkForProof'
    ];
    
    const emptyFields = required.filter(field => !formValues[field].trim());
    
    if (emptyFields.length > 0) {
      setError(`Please fill in the following fields: ${emptyFields.join(', ')}`);
      return false;
    }

    // Validate that non-admin users can only add/edit their own publications
    if (currentUser?.userType !== 'admin' && formValues.username !== currentUser.username) {
      setError("You can only manage your own publications");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formValues,
        teamno: currentUser.teamno,
      };

      const url = editingPublication
        ? `http://localhost:4000/user-api/publications/${editingPublication._id}`
        : "http://localhost:4000/user-api/publications";

      const response = await fetch(url, {
        method: editingPublication ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save publication");

      await fetchPublications();
      setSuccessMessage(editingPublication ? "Publication updated successfully!" : "Publication added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsModalOpen(false);
      setEditingPublication(null);
      setFormValues({
        ...formValues,
        typeOfPublication: "",
        nameOfJournal: "",
        titleOfPaper: "",
        dateOfPublication: "",
        indexing: "",
        authorPosition: "",
        linkForProof: "",
      });
      setError(null);
    } catch (error) {
      setError("Failed to save publication. Please try again.",error);
    }
  };

  const handleEdit = (publication) => {
    if (currentUser?.userType !== 'admin' && publication.username !== currentUser.username) {
      setError("You can only edit your own publications.");
      return;
    }
    setEditingPublication(publication);
    setFormValues({
      username: publication.username,
      typeOfPublication: publication.typeOfPublication,
      nameOfJournal: publication.nameOfJournal,
      titleOfPaper: publication.titleOfPaper,
      dateOfPublication: publication.dateOfPublication,
      indexing: publication.indexing,
      authorPosition: publication.authorPosition,
      linkForProof: publication.linkForProof,
    });
    setIsModalOpen(true);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-violet-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-violet-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-violet-800">Publications Management</h1>
        <button
          onClick={() => {
            setEditingPublication(null);
            setFormValues({
              ...formValues,
              username: currentUser.username,
              typeOfPublication: "",
              nameOfJournal: "",
              titleOfPaper: "",
              dateOfPublication: "",
              indexing: "",
              authorPosition: "",
              linkForProof: "",
            });
            setIsModalOpen(true);
            setError(null);
          }}
          className="bg-violet-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-violet-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Add New Publication
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-sm mb-6">
          {successMessage}
        </div>
      )}

{isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-violet-800">
                {editingPublication ? "Edit Publication" : "Add New Publication"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: "username", label: "Username" },
                { name: "typeOfPublication", label: "Type of Publication" },
                { name: "nameOfJournal", label: "Name of Journal" },
                { name: "titleOfPaper", label: "Title of Paper" },
                { name: "dateOfPublication", label: "Date of Publication", type: "date" },
                { name: "indexing", label: "Indexing" },
                { name: "authorPosition", label: "Author Position" },
                { name: "linkForProof", label: "Link for Proof" },
              ].map(({ name, label, type = "text" }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    id={name}
                    value={formValues[name]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-violet-700"
                >
                  {editingPublication ? "Update Publication" : "Add Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-violet-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">Journal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100">
              {publications.map((pub, index) => (
                <tr key={index} className="hover:bg-violet-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">{pub.teamno}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pub.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pub.typeOfPublication}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pub.nameOfJournal}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pub.titleOfPaper}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pub.authorPosition}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentUser?.userType === 'admin' || pub.username === currentUser?.username) && (
                      <button
                        onClick={() => handleEdit(pub)}
                        className="text-violet-600 hover:text-violet-800 font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Publications;