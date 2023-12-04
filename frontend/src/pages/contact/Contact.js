import React, { useState } from "react";
import Card from "../../components/card/Card";
import "./Contact.scss";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { toast } from "react-toastify";
import emailjs from "emailjs-com"; // Import emailjs

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
  
    try {
      // Send email using emailjs
      const response = await emailjs.sendForm("service_5dj0ujh", "template_mgdhodd", e.target, "cLROMfjhfLl0VZTr4");
      console.log("EmailJS Response:", response);
  
      // Clear form fields
      setSubject("");
      setMessage("");
  
      // Show success toast
      toast.success("Email Sent");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Email not sent, please try again");
    }
  };

  return (
    <div className="contact">
      <h3 className="--mt">Contact Us</h3>
      <div className="section">
        <form onSubmit={sendEmail}>
          <Card cardClass="card">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <label>Message</label>
            <textarea
              cols="30"
              rows="10"
              name="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button className="--btn --btn-primary">Send Message</button>
          </Card>
        </form>

        <div className="details">
          <Card cardClass={"card2"}>
            <h3>Our Contact Information</h3>
            <p>Fill the form or contact us via other channels listed below</p>

            <div className="icons">
              <span>
                <FaPhoneAlt />
                <p>7862398197</p>
              </span>
              <span>
                <FaEnvelope />
                <p>hjawebservicesllc@gmail.com</p>
              </span>
              <span>
                <GoLocation />
                <p>Harlam Alvarado</p>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
