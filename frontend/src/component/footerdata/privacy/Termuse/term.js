import React from "react";
import TermImage from "../../../../icon/privacy icon/term.mp4";

const Term = () => {
    return(
        <>
            <div className="privacy-video">
                <iframe 
                src="https://www.youtube.com/embed/NsQxJT2OG4k?si=0SftFwFuAJ9lIVWw" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>

                </iframe>

            </div>
            <div className="privacy-container">
                <div className="security">
                    <video src={TermImage} autoPlay loop muted />
                </div>    
                <div className="side-text">
                    <h1>Term of Use</h1><hr /><br />
                    <p>Welcome to ShopKart! By accessing and using our website, you agree to comply with the following terms and conditions. Please read them carefully before using our services.</p>
                    <p>1. Acceptance of Terms: By using ShopKart, you acknowledge that you have read, understood, and agreed to these terms of use. If you do not agree with any part of these terms, please refrain from using our website.</p>
                    <p>2. User Responsibilities: You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and up-to-date information when creating an account.</p>
                    <p>3. Product Information: We strive to provide accurate product descriptions and images. However, we do not guarantee the accuracy, completeness, or reliability of any product information on our website.</p>
                    <p>4. Intellectual Property: All content on ShopKart, including text, graphics, logos, images, and software, is the property of ShopKart and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our prior written consent.</p>
                    <p>5. Prohibited Activities: You agree not to engage in any activities that may disrupt or interfere with the functioning of our website, including but not limited to hacking, spamming, or transmitting malicious software.</p>
                    <p>6. Limitation of Liability: ShopKart shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our website or products.</p>
                    <p>7. Changes to Terms: We reserve the right to modify these terms of use at any time. Any changes will be effective immediately upon posting on our website. It is your responsibility to review the terms periodically.</p>
                    <p>8. Governing Law: These terms of use shall be governed by and construed in accordance with the laws of the jurisdiction in which ShopKart operates.</p>
                    <p>By using ShopKart, you acknowledge that you have read, understood, and agreed to these terms of use.</p>
                </div>
            </div>
        </> 
    );
};

export default Term;