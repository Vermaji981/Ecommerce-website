import React from "react";
import { IoLogoYoutube } from "react-icons/io";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";




const FooterBar = () => {
    return (
        <footer className="footer">
            <div className="d1">
                <h2>Useful Links</h2>
                <Link to="/PrivacyCard"><p>Privacy Policy</p></Link>
                <Link to="/Term"><p>Term of Use</p></Link>
                <Link to="/Return"><p>Return Policy</p></Link>
                <Link to="/Discount"><p>Discount Coupons</p></Link>

            </div>
            <div className="d2">
                <h3><strong>Company</strong></h3>
                <p>About us</p>
                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}><p>Contact us</p></Link>
                <p>Career</p>
                <p>Affiliate</p>
            </div>
            <div className="d3">
                <h3><strong>Follow Us On</strong></h3>
                <div className="social-icons">
                    <a href="https://facebook.com/" aria-label="Facebook"><FaSquareFacebook /></a>
                    <a href="https://instagram.com/" aria-label="Instagram"><FaInstagram /></a>
                    <a href="https://twitter.com/" aria-label="Twitter"><FaTwitter /></a>
                    <a href="https://linkedin.com/" aria-label="LinkedIn"><FaLinkedin /></a>
                    <a href="https://youtube.com/" aria-label="YouTube"><IoLogoYoutube /></a>
                </div>
            </div>
        </footer>
    );
};

export default FooterBar;
