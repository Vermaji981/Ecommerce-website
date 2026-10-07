import React from "react";
import RetuenImage from "../../../../icon/privacy icon/return.gif";

const Return = () => {
    return(
        <>

        <div className="privacy-video">
            <iframe 
            src="https://www.youtube.com/embed/a2g7Q8n9Li8?si=VkPvklPm6Wg29GrE" 
            title="YouTube video player" 
            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen>
            </iframe>
        </div>
        <div className="privacy-container">
            <div className="security">
                <img src={RetuenImage} alt="Return Gif" />
                
            </div>

            <div className="side-text">
                <h1>Return IN 7 Days</h1><hr /><br />
                    <p>At ShopKart, customer satisfaction is our highest priority. If you are not completely satisfied with your purchase, you may request a return within 7 days of receiving your order. To be eligible for a return, the item must be unused, unworn, in its original condition, and returned with all original packaging, tags, accessories, and proof of purchase. Returns may not be accepted for products that are damaged due to misuse, have been used, or fall under non-returnable categories such as personal care items, intimate wear, customized products, gift cards, or digital products. Once your returned item has been received and successfully inspected by our quality team, we will notify you of the approval or rejection of your return request. If approved, your refund or replacement will be processed according to your selected option and applicable payment method. ShopKart reserves the right to decline returns that do not meet the conditions outlined in this policy. Our goal is to ensure a fair, transparent, and hassle-free shopping experience for every customer.</p>
                    <p>Shop with confidence at ShopKart — because your satisfaction is our commitment.</p>
                
            </div>
        </div>
        </>
    );
};
export default Return;