
// Import Assets (ada di folder src/assets/)
import logoBooky from "@/assets/logo_booky.png";

import facebookIcon from "@/assets/facebook.png"; 
import instagramIcon from "@/assets/instagram.png"; 
import linkedinIcon from "@/assets/linkedin.png"; 
import tiktokIcon from "@/assets/tiktok.png"; 

interface SocialIconProps {
  src: string;
  alt: string;
}

const SocialIcon = ({ src, alt }: SocialIconProps) => (
    <img 
        src={src} 
        alt={alt} 
        // width: 40; height: 40; border-radius: radius-full; border-width: 1px;
        className="w-10 h-10 rounded-full border border-gray-300 object-cover shrink-0"
    />
);

export const Footer = () => {
    return (
        // Outer Container: width: 100%, height: 224px, justify-center & items-center (default untuk Flexbox di sini)
        <footer 
            className="w-full border-t flex justify-center px-4 py-6"
            style={{ height: '224px' }}
        >
            {/* Inner Content Container: flex 1 column, centered. */}
            <div 
                className="flex flex-col items-center text-center py-4"
                // Menggunakan gap 20px (80px total gap) untuk menghindari overflow vertikal pada height 224px
                style={{ maxWidth: '1140px', gap: '20px' }} 
            >
                {/* 1. Logo Booky + Text " Booky" (display-md) */}
                <div className="flex items-center gap-2">
                    <img src={logoBooky} alt="Booky Logo" className="w-8 h-8 shrink-0" /> 
                    <span 
                        className="font-bold text-[#0A0D12] whitespace-nowrap"
                        style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }} // display-md
                    >
                        Booky
                    </span>
                </div>

                {/* 2. Description text (text-md SemiBold) */}
                <p 
                    className="font-semibold text-center text-[#0A0D12]  mx-auto"
                    style={{ fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }} // text-md, letter-spacing -2%
                >
                    Discover inspiring stories & timeless knowledge, ready to borrow anytime. Explore online or visit our nearest library branch.
                </p>

                {/* 3. Social Media Title (text-md Bold) */}
                <p 
                    className="font-bold text-center text-[#0A0D12]"
                    style={{ fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0' }}
                >
                    Follow on Social Media
                </p>

                {/* 4. Social Icons */}
                <div className="flex gap-4">
                    <SocialIcon src={facebookIcon} alt="Facebook" />
                    <SocialIcon src={instagramIcon} alt="Instagram" />
                    <SocialIcon src={linkedinIcon} alt="LinkedIn" />
                    <SocialIcon src={tiktokIcon} alt="TikTok" />
                </div>
            </div>
        </footer>
    );
};