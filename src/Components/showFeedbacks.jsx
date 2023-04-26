import { useState, useEffect } from "react";
import contract from '../Contract';
import "./showfeedback.css";

function ShowFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackCount = await contract.methods.feedbackCount().call();
        const feedbackArray = [];
        for (let i = feedbackCount; i >= 1; i--) { 
          const feedback = await contract.methods.getFeedback(i).call();
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
    };
    fetchFeedbacks();
  }, []);


  const getCurrentUserWalletAddress = () => {
    return window.ethereum.selectedAddress;
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


  return (
    <div className="feedback-table-container">
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Feedback</th>
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
}

export default ShowFeedback;
