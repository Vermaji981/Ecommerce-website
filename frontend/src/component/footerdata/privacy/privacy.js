
import React from "react";
import SecurityImage from "../../../icon/privacy icon/spy-hat-glasses.gif";

const PrivacyCard = () => {
  return (
    <>
      <div className="privacy-video">
        <iframe
          src="https://www.youtube.com/embed/H41fuhz_gvw?si=vOK87DmKyvV0KdZo"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <hr />

      <div className="privacy-container">
        <div className="security">
          <img src={SecurityImage} alt="Security GIF" />
        </div>
          <div className="side-text">
            <h1>Website Security and Privacy is high</h1><hr/><br/>
            <ul>
              <li>"Your Privacy, Our Priority."</li>
              <li>"Shop with Confidence, Protected Every Step of the Way."</li>
              <li>"We Respect Your Privacy and Protect Your Data."</li>
              <li>"Safe Shopping Starts with Secure Information."</li>
              <li>"Your Trust Matters — We Keep Your Data Secure."</li>
              <li>"Committed to Protecting Your Personal Information."</li>
              <li>"Privacy You Can Trust, Security You Can Count On."</li>
              <li>"Keeping Your Information Safe While You Shop."</li>
              <li>"Transparent Privacy, Secure Shopping Experience."</li>
              <li>"Your Data is Protected with Industry-Standard Security."</li>
            </ul>
          </div>
      </div>
    </>
  );
};

export default PrivacyCard;