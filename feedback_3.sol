// SPDX-License-Identifier: Unlicense
pragma solidity >=0.5.0 <0.9.0;

contract FeedbackContract {

    address public admin;
    uint256 public feedbackCount;
    uint256 public grievanceCount;
    mapping (uint256 => Feedback) public feedbacks;
    mapping (uint256 => Grievance) private grievances;

    struct Feedback {
        uint256 id;
        address userAddress;
        string message;
    }

    struct Grievance {
        uint256 id;
        address userAddress;
        string message;
    }

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    function addFeedback(string memory _feedback) public {
        feedbackCount++;
        feedbacks[feedbackCount] = Feedback(feedbackCount, msg.sender, _feedback);
    }

    function addGrievance(string memory _grievance) public {
        grievanceCount++;
        grievances[grievanceCount] = Grievance(grievanceCount, msg.sender, _grievance);
    }

    function getFeedback(uint256 _id) public view returns (uint256, address, string memory) {
        require(_id > 0 && _id <= feedbackCount, "Invalid feedback ID.");
        Feedback memory feedback = feedbacks[_id];
        return (feedback.id, feedback.userAddress, feedback.message);
    }

    function getGrievance(uint256 _id) public view onlyAdmin returns (uint256, address, string memory) {
        require(_id > 0 && _id <= grievanceCount, "Invalid grievance ID.");
        Grievance memory grievance = grievances[_id];
        return (grievance.id, grievance.userAddress, grievance.message);
    }

    function deleteFeedback(uint256 _id) public onlyAdmin {
        require(_id > 0 && _id <= feedbackCount, "Invalid feedback ID.");
        delete feedbacks[_id];
    }

    function deleteGrievance(uint256 _id) public onlyAdmin {
        require(_id > 0 && _id <= grievanceCount, "Invalid grievance ID.");
        delete grievances[_id];
    }
}
