import Button from "@mui/material/Button";
import { useState, useRef, useEffect } from "react";
import {
  FaAngleDown,
  FaAngleRight,
  FaMobileAlt,
  FaLaptop,
  FaTv,
  FaGlasses,
  FaClock,
  FaBirthdayCake,
  FaShoppingBag,
  FaUtensils,
  FaBlog,
  FaTshirt,
  FaBreadSlice,
  FaAppleAlt,
} from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpenSubtitles, setIsOpenSubtitles] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const part1Ref = useRef(null);

  const handleMobileSubmenuToggle = (menuKey) => {
    setMobileSubmenuOpen((prev) => (prev === menuKey ? null : menuKey));
  };

  useEffect(() => {
    function handleOutside(e) {
      if (part1Ref.current && !part1Ref.current.contains(e.target)) {
        setIsOpenSubtitles(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <>
      <nav>
        <div className="nav-bar">
          <div className="row">
            <div className="col-sm-3 part1" ref={part1Ref}>
              <button
                className="all-cat-tab align-items-center"
                onClick={() => setIsOpenSubtitles(!isOpenSubtitles)}
              >
                <span className="Icon1 mr-2">
                  <IoIosMenu />
                </span>
                <span className="text">ALL CATEGORIES</span>
                <span className="Icon2 ml-2">
                  <FaAngleDown />
                </span>
              </button>
              <div className={`subtitles ${isOpenSubtitles ? "open" : ""}`}>
                <ul>
                  <li>
                    <Link to="/shop">
                      <Button>
                        On Sale <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/Sunglass">
                        <Button>
                          Sunglass <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Shoes">
                        <Button>
                          Shoes <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Mobiles">
                        <Button>
                          Mobiles <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Computer">
                        <Button>
                          Computer <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Grocery">
                        <Button>
                          Grocery <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/Mobiles">
                      <Button>
                        Mobiles <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/Mobiles">
                        <Button>
                          Samsung <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Mobiles">
                        <Button>
                          Apple <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Mobiles">
                        <Button>
                          Vivo <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Mobiles">
                        <Button>
                          Realme <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/Computer">
                      <Button>
                        Computer <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/Computer">
                        <Button>
                          Hp Computer <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Computer">
                        <Button>
                          Asus Computer <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Computer">
                        <Button>
                          iMac Apple <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Computer">
                        <Button>
                          Lenovo <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/shop">
                      <Button>
                        Books <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/shop?search=Books">
                        <Button>
                          Poetry Books <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/shop?search=Books">
                        <Button>
                          Math Books <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/shop?search=Books">
                        <Button>
                          Science Books <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/Fitness">
                      <Button>
                        Fitness <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/Fitness">
                        <Button>
                          Gym Bench <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Fitness">
                        <Button>
                          Dumbbells <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Fitness">
                        <Button>
                          Resistance Bands <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/MobileCovers">
                      <Button>
                        Mobile Covers <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/MobileCovers">
                        <Button>
                          iPhone Covers <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/MobileCovers">
                        <Button>
                          Samsung Covers <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/HomeKitchen">
                      <Button>
                        Home & Kitchen <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/HomeKitchen">
                        <Button>
                          Grinder <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/HomeKitchen">
                        <Button>
                          Induction <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/Furniture">
                      <Button>
                        Furniture <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/Furniture">
                        <Button>
                          Sofa <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Furniture">
                        <Button>
                          Chair <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/Grocery">
                      <Button>
                        Grocery <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/Grocery">
                        <Button>
                          Atta & Flours <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Grocery">
                        <Button>
                          Dal & Oil <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link to="/Watches">
                      <Button>
                        Watches <FaAngleRight />
                      </Button>
                    </Link>
                    <div className="sidetitlemenu">
                      <Link to="/Watches">
                        <Button>
                          Timex <FaAngleRight />
                        </Button>
                      </Link>
                      <Link to="/Watches">
                        <Button>
                          Fastrack <FaAngleRight />
                        </Button>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-sm-9 part2 d-flex align-items-center">
              <ul className="list list-inline ml-auto">
                <li className="list-inline-item">
                  <Link to="/">
                    <button>Home</button>
                  </Link>
                </li>

                {/* MEN SUBMENU */}
                <li
                  className={`list-inline-item nav-has-submenu ${mobileSubmenuOpen === "Men" ? "mobile-open" : ""
                    }`}
                >
                  <div className="nav-item-mobile">
                    <Link to="/shop?search=Men">
                      <button>
                        Men <FaAngleDown className="submenu-arrow-icon" />
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="submenu-toggle"
                      onClick={() => handleMobileSubmenuToggle("Men")}
                      aria-expanded={mobileSubmenuOpen === "Men"}
                      aria-label="Toggle Men submenu"
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                  <div className="submenu row shadow">
                    <Link to="/Shoes">
                      <Button>
                        <FaShoppingBag className="menu-icon" /> Shoes
                      </Button>
                    </Link>
                    <Link to="/Watches">
                      <Button>
                        <FaClock className="menu-icon" /> Watches
                      </Button>
                    </Link>
                    <Link to="/Sunglass">
                      <Button>
                        <FaGlasses className="menu-icon" /> Sunglasses
                      </Button>
                    </Link>
                    <Link to="/shop?search=Shirt">
                      <Button>
                        <FaTshirt className="menu-icon" /> Men Shirts
                      </Button>
                    </Link>
                  </div>
                </li>

                {/* ELECTRONIC SUBMENU */}
                <li
                  className={`list-inline-item nav-has-submenu ${mobileSubmenuOpen === "Electronic" ? "mobile-open" : ""
                    }`}
                >
                  <div className="nav-item-mobile">
                    <Link to="/Mobiles">
                      <button>
                        Electronic <FaAngleDown className="submenu-arrow-icon" />
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="submenu-toggle"
                      onClick={() => handleMobileSubmenuToggle("Electronic")}
                      aria-expanded={mobileSubmenuOpen === "Electronic"}
                      aria-label="Toggle Electronic submenu"
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                  <div className="submenu row shadow">
                    <Link to="/Mobiles">
                      <Button>
                        <FaMobileAlt className="menu-icon" /> Mobiles & Phones
                      </Button>
                    </Link>
                    <Link to="/Computer">
                      <Button>
                        <FaLaptop className="menu-icon" /> Computers & Laptops
                      </Button>
                    </Link>
                    <Link to="/shop?search=Tv">
                      <Button>
                        <FaTv className="menu-icon" /> Smart TV & Display
                      </Button>
                    </Link>
                    <Link to="/HomeKitchen">
                      <Button>
                        <FaUtensils className="menu-icon" /> Fridge & Appliances
                      </Button>
                    </Link>
                  </div>
                </li>

                {/* BAKERY SUBMENU */}
                <li
                  className={`list-inline-item nav-has-submenu ${mobileSubmenuOpen === "Bakery" ? "mobile-open" : ""
                    }`}
                >
                  <div className="nav-item-mobile">
                    <Link to="/Grocery">
                      <button>
                        Bakery <FaAngleDown className="submenu-arrow-icon" />
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="submenu-toggle"
                      onClick={() => handleMobileSubmenuToggle("Bakery")}
                      aria-expanded={mobileSubmenuOpen === "Bakery"}
                      aria-label="Toggle Bakery submenu"
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                  <div className="submenu row shadow">
                    <Link to="/shop?search=Cake">
                      <Button>
                        <FaBirthdayCake className="menu-icon" /> Fresh Cakes
                      </Button>
                    </Link>
                    <Link to="/shop?search=Pastry">
                      <Button>
                        <FaAppleAlt className="menu-icon" /> Pastries & Treats
                      </Button>
                    </Link>
                    <Link to="/shop?search=Drinks">
                      <Button>
                        <FaShoppingBag className="menu-icon" /> Cold Drinks & Soda
                      </Button>
                    </Link>
                    <Link to="/Grocery">
                      <Button>
                        <FaBreadSlice className="menu-icon" /> Breads & Biscuits
                      </Button>
                    </Link>
                  </div>
                </li>

                {/* GROCERY SUBMENU */}
                <li
                  className={`list-inline-item nav-has-submenu ${mobileSubmenuOpen === "Grocery" ? "mobile-open" : ""
                    }`}
                >
                  <div className="nav-item-mobile">
                    <Link to="/Grocery">
                      <button>
                        Grocery <FaAngleDown className="submenu-arrow-icon" />
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="submenu-toggle"
                      onClick={() => handleMobileSubmenuToggle("Grocery")}
                      aria-expanded={mobileSubmenuOpen === "Grocery"}
                      aria-label="Toggle Grocery submenu"
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                  <div className="submenu row shadow">
                    <Link to="/Grocery">
                      <Button>
                        <FaUtensils className="menu-icon" /> Atta & Organic Flours
                      </Button>
                    </Link>
                    <Link to="/Grocery">
                      <Button>
                        <FaUtensils className="menu-icon" /> Dal & Pulses
                      </Button>
                    </Link>
                    <Link to="/Grocery">
                      <Button>
                        <FaUtensils className="menu-icon" /> Cooking Oil & Ghee
                      </Button>
                    </Link>
                    <Link to="/Grocery">
                      <Button>
                        <FaUtensils className="menu-icon" /> Spices & Sauces
                      </Button>
                    </Link>
                  </div>
                </li>

                {/* BLOG SUBMENU */}
                <li
                  className={`list-inline-item nav-has-submenu ${mobileSubmenuOpen === "Blog" ? "mobile-open" : ""
                    }`}
                >
                  <div className="nav-item-mobile">
                    <Link to="/shop">
                      <button>
                        Blog <FaAngleDown className="submenu-arrow-icon" />
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="submenu-toggle"
                      onClick={() => handleMobileSubmenuToggle("Blog")}
                      aria-expanded={mobileSubmenuOpen === "Blog"}
                      aria-label="Toggle Blog submenu"
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                  <div className="submenu row shadow">
                    <Link to="/shop">
                      <Button>
                        <FaBlog className="menu-icon" /> Shopping Guides 2026
                      </Button>
                    </Link>
                    <Link to="/Computer">
                      <Button>
                        <FaLaptop className="menu-icon" /> Tech Reviews & Trends
                      </Button>
                    </Link>
                    <Link to="/Sunglass">
                      <Button>
                        <FaGlasses className="menu-icon" /> Fashion Tips
                      </Button>
                    </Link>
                  </div>
                </li>

                {/* CONTACT US */}
                <li className="list-inline-item">
                  <Link to="/contact">
                    <button>Contact Us</button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;