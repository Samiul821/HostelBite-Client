import React from "react";
import { useTheme } from "../../../Hooks/useTheme";

const Footer = () => {
  const { isDark, colors } = useTheme();

  return (
    <footer
      className={`${colors.background} ${colors.text} py-8 px-[3%] lg:px-[10%]`}
    >
      <div className=" flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold mb-2">HostelBite</h2>
          <p className="text-sm max-w-xs">
            Delicious meals made easy for your hostel lifestyle. Explore, order,
            and enjoy!
          </p>
        </div>

        {/* Center - Quick Links */}
        <div className="flex gap-8">
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="/"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/meals"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Meals
                </a>
              </li>
              <li>
                <a
                  href="/upcoming"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Upcoming Meals
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Membership</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="/checkout/silver"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Silver Package
                </a>
              </li>
              <li>
                <a
                  href="/checkout/gold"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Gold Package
                </a>
              </li>
              <li>
                <a
                  href="/checkout/platinum"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Platinum Package
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right - Social */}
        <div className="text-center md:text-right">
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-end gap-4 text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M22.675 0h-21.35C.594 0 0 .593 0 1.326v21.348C0 23.406.594 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .593 23.406 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.933 4.933 0 002.165-2.724c-.951.555-2.005.959-3.127 1.184A4.92 4.92 0 0016.616 3c-2.717 0-4.92 2.204-4.92 4.92 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.148-5.144-.424.726-.666 1.57-.666 2.476 0 1.708.87 3.215 2.188 4.099a4.902 4.902 0 01-2.228-.616v.061c0 2.388 1.7 4.384 3.946 4.833a4.936 4.936 0 01-2.224.085c.626 1.954 2.444 3.377 4.6 3.417a9.874 9.874 0 01-6.102 2.105c-.396 0-.79-.023-1.17-.068A13.945 13.945 0 007.548 21c9.056 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.75-.25a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-400/20 my-8" />

      <p className="text-center text-xs md:text-sm select-none">
        &copy; {new Date().getFullYear()} HostelBite. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
