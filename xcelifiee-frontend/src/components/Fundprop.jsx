import { useState } from "react";
import { motion } from "framer-motion";

function Fundprop() {
  const [newProposal, setNewProposal] = useState({
    titleOfProposal: "",
    detailsOfPiCopi: "",
    fundingAgency: "",
    amount: "",
    fundStatus: "",
  });

  // Handle form submission
  const handleAddProposal = async () => {
    if (newProposal.titleOfProposal && newProposal.detailsOfPiCopi && newProposal.fundingAgency && newProposal.amount && newProposal.fundStatus) {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const user = JSON.parse(localStorage.getItem("user")); // Parse user object from localStorage
        const teamno = user?.teamno; // Safely access teamno property
  
        if (!token) {
          alert("User is not authenticated. Please log in.");
          return;
        }
  
        const payload = {
          ...newProposal,
          teamno, // Include teamno in the request payload
        };
  
        const response = await fetch('http://localhost:4000/user-api/fundprops', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          console.log("Proposal added successfully");
          // Reset form fields after successful submission
          setNewProposal({
            titleOfProposal: "",
            detailsOfPiCopi: "",
            fundingAgency: "",
            amount: "",
            fundStatus: "",
          });
          alert("Proposal added successfully");
        } else {
          const errorData = await response.json();
          console.error("Failed to add proposal:", errorData.message || "Unknown error");
          alert("Failed to add proposal. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("There was an error adding the proposal. Please try again.");
      }
    } else {
      alert("Please fill all fields");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100">
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 hover:shadow-2xl transition-shadow duration-300 p-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-center mb-6 text-violet-800"
          >
            Add New Funding Proposal
          </motion.h2>

          <div className="space-y-6">
            {[
              { label: "Title of Proposal", name: "titleOfProposal" },
              { label: "Details of PI & Co-PI", name: "detailsOfPiCopi" },
              { label: "Funding Agency", name: "fundingAgency" },
              { label: "Amount", name: "amount" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-violet-700 hover:text-violet-800 text-lg mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={newProposal[name]}
                  onChange={(e) => setNewProposal({ ...newProposal, [name]: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 text-black focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
                  placeholder={label}
                />
              </div>
            ))}

            <div>
              <label className="block text-violet-700 hover:text-violet-800 text-lg mb-2">
                Fund Status
              </label>
              <input
                type="text"
                name="fundStatus"
                value={newProposal.fundStatus}
                onChange={(e) => setNewProposal({ ...newProposal, fundStatus: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 text-black focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
                placeholder="Fund Status"
              />
            </div>

            <motion.button
              type="button"
              onClick={handleAddProposal}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-violet-700 text-white font-semibold py-3 rounded-lg border border-transparent hover:bg-white hover:text-violet-700 hover:border-violet-700 text-lg transition-colors duration-300 shadow-md hover:shadow-lg hover:shadow-violet-500/50 transform hover:scale-105 transition-all duration-400 ease-in-out"
            >
              Add Proposal
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fundprop;
