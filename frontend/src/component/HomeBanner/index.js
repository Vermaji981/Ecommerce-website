import React from "react";
import Slider from "react-slick";
import furniture from "../../image/furniture.jfif";
import { galaxysamsung, workerimage } from "../../slider";

const HomeBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    arrows: false,
  };

  const slides = [
    {
      title: "Women Fashion",
      image: furniture,
      alt: "Lady wearing fashion outfit",
      type: "image",
    },
    {
      title: "Work Essentials",
      image: workerimage,
      alt: "Worker with equipment",
      type: "image",
    },
    {
      title: "Galaxy",
      media: galaxysamsung,
      alt: "Show the World",
      type: "video",
    },
  ];

  return (
    <div className="homeBannerSection">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.title} className="Items">
            {slide.type === "video" ? (
              <video
                src={slide.media}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              //   style={{ width: "100%", height: "400px", objectFit: "cover" }}
               />
            ) : (
              <img
                src={slide.image}
                alt={slide.alt}
                // style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            )}
            <h3>{slide.title}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeBanner;