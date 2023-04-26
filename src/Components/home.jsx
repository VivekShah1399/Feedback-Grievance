import { useState,useEffect} from "react";
import contract from '../Contract';
import "./Home.css";
import "./grievance.css";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isFeedback, setIsFeedback] = useState(true);
  const [showTable, setShowTable] = useState(false);
 const [feedbacks, setFeedbacks] = useState([]);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSelectChange = (e) => {
    setIsFeedback(e.target.value === "feedback");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFeedback) {
      await contract.methods.addFeedback(inputValue)
        .send({ from: window.ethereum.selectedAddress });
      alert("Success adding feedback");
    } else {
      await contract.methods.addGrievance(inputValue)
        .send({ from: window.ethereum.selectedAddress });
    }
    setInputValue("");
  };

  const getCurrentUserWalletAddress = () => {
    return window.ethereum.selectedAddress;
  };


  const handleGrievance = async (e) => {

    const currentUserWalletAddress = await getCurrentUserWalletAddress();
    const adminAddress = await contract.methods.admin().call({ from: currentUserWalletAddress });

    
    const fetchFeedbacks = async () => {
      if (currentUserWalletAddress.toLowerCase() === adminAddress.toLowerCase() ) {
        setShowTable(true);
      try {
        const feedbackCount = await contract.methods.grievanceCount().call();
        const feedbackArray = [];
        for (let i = feedbackCount; i >= 1; i--) { 
          const feedback = await contract.methods.getGrievance(i).call();
          feedbackArray.push({
            id: feedback[0],
            owner: feedback[1],
            feedback: feedback[2],
          });
        }
        setFeedbacks(feedbackArray);
      } catch (error) {
        console.log(error);
      }
    }else{
      alert("Only Admin Can View the Grievances");
    }
    };

    fetchFeedbacks();
  };

  const handleDelete = async (id,owner) => {
    try {
      const currentUserWalletAddress = await getCurrentUserWalletAddress();
      const adminAddress = await contract.methods.admin().call({ from: currentUserWalletAddress });
      if (currentUserWalletAddress.toLowerCase() === adminAddress.toLowerCase() ) {
        await contract.methods.deleteFeedback(id).send({ from: currentUserWalletAddress });
        setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
      } else {
        alert("Only admin can delete feedback");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderTable = () => {
    if (!showTable) {
      return null;
    }

    return (
      <div className="grievance-table-container">
      <table className="grievance-table">
        <thead>
          <tr>
            <th>Grievance</th>
            <th>Owner</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.feedback}</td>
              <td>{feedback.owner}</td>
              <td><button type="submit" onClick={() => handleDelete(feedback.id,feedback.owner)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={isFeedback ? "feedback" : "grievance"} onChange={handleSelectChange}>
          <option value="feedback">Feedback</option>
          <option value="grievance">Grievance</option>
        </select>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit" className="submit">Submit</button>
        
      </form>
      <br></br>
      <button className="View-grievance" onClick={() => handleGrievance()}>Show Grievance</button>
      {renderTable()}
    </div>
  );
}

export default Home;
