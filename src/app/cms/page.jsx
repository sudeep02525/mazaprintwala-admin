'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  HelpCircle,
  ShieldCheck,
  Megaphone,
  PhoneCall,
  FileText,
  Truck,
  Sparkles,
  Headphones,
  CheckCircle,
  Clock,
  Star,
  Zap,
  CreditCard,
  ChevronUp,
  ChevronDown,
  Upload,
  LayoutGrid,
  Type,
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';
import { getImageUrl } from '@/utils/getImageUrl.js';

const EMPTY_SLIDE = { image: '', title: '', subtitle: '', ctaText: '', ctaLink: '' };
const EMPTY_BANNER = { image: '', badge: '', title: '', subtitle: '', ctaText: '', ctaLink: '' };
const EMPTY_COLUMN = { title: '', links: [{ label: '', href: '' }] };

const DEFAULT_FOOTER = {
  tagline: '',
  supportPhone: '',
  supportEmail: '',
  social: { facebook: '', instagram: '', twitter: '', linkedin: '' },
  columns: [],
};

const DEFAULT_OFFER_STRIP = {
  isActive: false,
  badge: 'SPECIAL OFFER',
  badge_hi: 'विशेष ऑफर',
  badge_mr: 'विशेष ऑफर',
  text: 'Flat 40% OFF on all Bulk & Corporate Orders | Free Pan-India Delivery',
  text_hi: 'सभी बल्क और कॉर्पोरेट ऑर्डर पर फ्लैट 40% की छूट | मुफ़्त अखिल भारतीय डिलीवरी',
  text_mr: 'सर्व मोठ्या आणि कॉर्पोरेट ऑर्डर्सवर 40% सूट | मोफत भारतभर वितरण',
  linkLabel: 'Order Now',
  linkLabel_hi: 'अभी ऑर्डर करें',
  linkLabel_mr: 'आता ऑर्डर करा',
  linkTarget: '/products',
  bgStyle: 'blue',
};

const DEFAULT_TRUST_ITEMS = [
  {
    icon: 'ShieldCheck',
    title: 'Precision Colors',
    description: 'CMYK calibrated offset & digital machines',
    isActive: true,
  },
  {
    icon: 'Truck',
    title: 'Tracked Transit',
    description: 'Insured courier with real-time tracking across 25k+ pin codes',
    isActive: true,
  },
  {
    icon: 'Sparkles',
    title: '100% Compliant',
    description: 'B2B GST invoices & transparent volume pricing',
    isActive: true,
  },
  {
    icon: 'Headphones',
    title: 'Expert Help',
    description: 'Pre-flight file check before sending to print',
    isActive: true,
  },
];

const DEFAULT_FAQS = [
  {
    question: 'What services does Maza Printwala offer?',
    answer: 'We offer a wide range of services including business printing, custom apparel, packaging, corporate gifts, and personalized items.',
    isActive: true,
  },
  {
    question: 'Can I order custom printed products online?',
    answer: 'Yes, you can browse, customize, and order all our products directly through our website with easy online payment options.',
    isActive: true,
  },
  {
    question: 'Does Maza Printwala provide same-day delivery?',
    answer: 'Same-day delivery is available for select products and pin codes. Standard delivery takes 3-4 working days.',
    isActive: true,
  },
  {
    question: 'What are the most popular products on Maza Printwala?',
    answer: 'Our most popular products include Visiting Cards, Custom T-shirts, Corporate Gift Sets, and Custom Packaging.',
    isActive: true,
  },
  {
    question: 'Can I order small quantities or single-piece prints?',
    answer: 'Yes, we cater to both bulk orders and single-piece custom printing without any strict minimum order quantities.',
    isActive: true,
  },
  {
    question: 'Does Maza Printwala offer printing solutions for businesses?',
    answer: 'Absolutely! We offer dedicated B2B portal access, volume discounts, and GST invoicing for corporate clients.',
    isActive: true,
  },
  {
    question: 'How can I design my product on Maza Printwala?',
    answer: 'You can upload your own artwork, customize ready-made templates, or hire one of our professional designers.',
    isActive: true,
  },
  {
    question: 'Does Maza Printwala deliver across India?',
    answer: 'Yes, we provide fast and secure pan-India shipping covering over 25,000+ pin codes.',
    isActive: true,
  },
  {
    question: 'What types of document printing services are available?',
    answer: 'We offer colour and B&W printing, spiral binding, hardcover thesis binding, lamination, and project report printing.',
    isActive: true,
  },
  {
    question: 'How can I track my print order?',
    answer: 'Once your order is dispatched, you will receive a tracking link via SMS/WhatsApp, or track it directly from your Account.',
    isActive: true,
  },
];

const DEFAULT_CONTACT = {
  supportPhone: '+91 7700054984',
  whatsappNumber: '+91 7700054984',
  supportEmail: 'imagemazaprintwala@gmail.com',
  addressLine1: 'Shop No. 4, Commercial Print Hub',
  addressLine1_hi: 'दुकान नं. 4, कमर्शियल प्रिंट हब',
  addressLine1_mr: 'दुकान क्र. 4, कमर्शियल प्रिंट हब',
  addressLine2: 'Market Yard Road',
  addressLine2_hi: 'मार्केट यार्ड रोड',
  addressLine2_mr: 'मार्केट यार्ड रोड',
  city: 'Mumbai',
  city_hi: 'मुंबई',
  city_mr: 'मुंबई',
  state: 'Maharashtra',
  state_hi: 'महाराष्ट्र',
  state_mr: 'महाराष्ट्र',
  pincode: '400001',
  workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  workingHours_hi: 'सोम - शनि: 10:00 पूर्वाह्न - 7:00 अपराह्न',
  workingHours_mr: 'सोम - शनि: सकाळी 10:00 - संध्याकाळी 7:00',
  physicalAddress: '',
  physicalAddress_hi: '',
  physicalAddress_mr: '',
  gstin: '27AAAAA0000A1Z5',
};

const DEFAULT_POLICIES = {
  privacy: {
    title: 'Privacy & Cookie Policy',
    lastUpdated: 'November 2026',
    body: 'Maza Printwala respects your privacy. We collect only information essential to process your printing orders, ensure timely delivery, and provide customer assistance. We never sell your personal information or shared artwork files.',
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'November 2026',
    body: 'By placing an order on Maza Printwala, you agree that your submitted design files do not infringe upon any third-party copyrights or trademarks. All printed goods undergo strict quality inspection before dispatch.',
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    lastUpdated: 'November 2026',
    body: 'We deliver pan-India covering over 25,000+ pin codes via premium logistics partners. Standard delivery turnaround is 3 to 5 business days after artwork approval. Express delivery options are available for select metro locations.',
  },
  returns: {
    title: 'Return & Cancellation Policy',
    lastUpdated: 'November 2026',
    body: 'Because custom-printed goods are customized specifically to your specifications, orders cannot be cancelled once print production begins. If you receive merchandise with physical defects, printing errors, or transit damage, contact support within 48 hours for immediate replacement.',
  },
};

const DEFAULT_CATEGORY_BLOCKS = [
  {
    title: 'Business Essentials',
    title_hi: 'बिजनेस एसेंशियल्स',
    title_mr: 'बिझनेस एसेंशियल्स',
    tiles: [
      { name: 'Visiting Cards', name_hi: 'विजिटिंग कार्ड्स', name_mr: 'व्हिजिटिंग कार्ड्स', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262678/maaza-printwala/images/cat_visiting_cards_new_1785478123231.jpg', link: '/visiting-cards', isActive: true },
      { name: 'Notebooks', name_hi: 'नोटबुक्स व डायरी', name_mr: 'नोटबुक्स आणि डायरी', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262673/maaza-printwala/images/cat_notebooks_new_1785478132458.jpg', link: '/stationery?sub=notebooks', isActive: true },
      { name: 'Custom Mugs', name_hi: 'कस्टम प्रिंटेड मग्स', name_mr: 'कस्टम प्रिंटेड मग्स', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262674/maaza-printwala/images/cat_mugs_new_1785478141544.jpg', link: '/products?search=mug', isActive: true },
      { name: 'Custom Clothing, Bags & Caps', name_hi: 'कस्टम परिधान, बैग और कैप', name_mr: 'सानुकूल कपडे, बॅग्ज आणि टोप्या', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262671/maaza-printwala/images/cat_clothing_new_1785478162007.jpg', link: '/products?search=apparel', isActive: true },
    ],
  },
  {
    title: 'Custom Apparel',
    title_hi: 'कस्टम परिधान (Apparel)',
    title_mr: 'सानुकूल कपडे (Apparel)',
    tiles: [
      { name: 'Custom Polo T-shirts', name_hi: 'पोलो टी-शर्ट्स', name_mr: 'पोलो टी-शर्ट्स', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262676/maaza-printwala/images/cat_polo_new_1785478171451.jpg', link: '/products?search=polo', isActive: true },
      { name: 'Custom T-shirts', name_hi: 'कॉटन टी-शर्ट्स', name_mr: 'कॉटन टी-शर्ट्स', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262677/maaza-printwala/images/cat_tshirt_new_1785478181285.jpg', link: '/products?search=t-shirt', isActive: true },
      { name: 'Custom Formal Shirts', name_hi: 'फॉर्मल शर्ट्स', name_mr: 'फॉर्मल शर्ट्स', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262668/maaza-printwala/images/cat_formal_new_1785478190948.jpg', link: '/products?search=apparel', isActive: true },
      { name: 'Caps', name_hi: 'प्रिंटेड कैप्स', name_mr: 'प्रिंटेड टोप्या', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262663/maaza-printwala/images/cat_caps_new_1785478209032.jpg', link: '/products?search=cap', isActive: true },
    ],
  },
];

const DEFAULT_HOME_HEADINGS = {
  bestSellersTitle: 'Best Selling Products',
  bestSellersTitle_hi: 'सबसे ज्यादा बिकने वाले उत्पाद',
  bestSellersTitle_mr: 'सर्वाधिक विक्री होणारी उत्पादने',
  bestSellersSubtitle: 'Most ordered commercial print and merchandise products',
  bestSellersSubtitle_hi: 'व्यावसायिक प्रिंट एवं मर्चेंडाइज़ के सबसे लोकप्रिय उत्पाद',
  bestSellersSubtitle_mr: 'सर्वाधिक लोकप्रिय व्यावसायिक प्रिंट आणि उत्पादने',
  newArrivalsTitle: 'New Arrivals & Fresh Templates',
  newArrivalsTitle_hi: 'नए आगमन और फ्रेश टेम्प्लेट्स',
  newArrivalsTitle_mr: 'नवीन उत्पादने आणि टेम्पलेट्स',
  newArrivalsSubtitle: 'Fresh new templates and products',
  newArrivalsSubtitle_hi: 'ताज़ा नए टेम्प्लेट और डिज़ाइन उत्पाद',
  newArrivalsSubtitle_mr: 'ताजी नवीन टेम्पलेट्स आणि डिझाइन उत्पादने',
  corporateTitle: 'Corporate Essentials & Gifting',
  corporateTitle_hi: 'कॉर्पोरेट एसेंशियल्स और गिफ्टिंग',
  corporateTitle_mr: 'कॉर्पोरेट एसेंशियल्स आणि गिफ्टिंग',
  corporateSubtitle: 'Bulk corporate solutions with custom GST invoicing',
  corporateSubtitle_hi: 'कस्टम GST इनवॉइसिंग के साथ थोक कॉर्पोरेट समाधान',
  corporateSubtitle_mr: 'सानुकूल GST इनव्हॉइसिंगसह कॉर्पोरेट उपाय',
  trendingTitle: 'Trending Print Catalogue',
  trendingTitle_hi: 'ट्रेंडिंग प्रिंट कैटलॉग',
  trendingTitle_mr: 'ट्रेंडिंग प्रिंट कॅटलॉग',
  trendingSubtitle: 'Top rated commercial solutions popular this month',
  trendingSubtitle_hi: 'इस महीने के शीर्ष रेटेड व्यावसायिक समाधान',
  trendingSubtitle_mr: 'या महिन्यातील टॉप रेटेड व्यावसायिक सोल्यूशन्स',
  popularSearchesTitle: 'Popular Searches',
  popularSearchesTitle_hi: 'लोकप्रिय खोजें',
  popularSearchesTitle_mr: 'लोकप्रिय शोध',
};

const DEFAULT_PAYMENTS = {
  enabled: true,
  badges: [
    { id: 'visa', label: 'VISA', label_hi: 'VISA', label_mr: 'VISA', enabled: true },
    { id: 'mc', label: 'Mastercard', label_hi: 'मास्टरकार्ड', label_mr: 'मास्टरकार्ड', enabled: true },
    { id: 'upi', label: 'UPI', label_hi: 'UPI', label_mr: 'UPI', enabled: true },
    { id: 'rupay', label: 'RuPay', label_hi: 'रुपे (RuPay)', label_mr: 'रुपे (RuPay)', enabled: true },
    { id: 'netbanking', label: 'Net Banking', label_hi: 'नेट बैंकिंग', label_mr: 'नेट बँकिंग', enabled: false },
    { id: 'cod', label: 'Cash on Delivery', label_hi: 'कैश ऑन डिलीवरी', label_mr: 'कॅश ऑन डिलिव्हरी', enabled: false },
  ],
};

const DEFAULT_ABOUT_PAGE = {
  badge: 'About Maza Printwala',
  badge_hi: 'Maza Printwala के बारे में',
  badge_mr: 'Maza Printwala बद्दल',
  title: 'Precision Industrial Printing For Growing Businesses',
  title_hi: 'उद्योग-अग्रणी गुणवत्ता, आधुनिक व्यवसायों के लिए तैयार',
  title_mr: 'उद्योग-अग्रणी गुणवत्ता, आधुनिक व्यवसायांसाठी सज्ज',
  subtitle: 'From bespoke visiting cards to high-volume commercial packaging, we combine German print machinery with seamless digital convenience.',
  subtitle_hi: 'प्रीमियम विजिटिंग कार्ड्स से लेकर हाई-वॉल्यूम पैकेजिंग और कॉर्पोरेट परिधान तक, हम जर्मन प्रिंट तकनीक को डिजिटल सुविधा के साथ जोड़ते हैं।',
  subtitle_mr: 'प्रीमियम व्हिजिटिंग कार्ड्सपासून ते मोठ्या प्रमाणातील पॅकेजिंग आणि कॉर्पोरेट कपड्यांपर्यंत, आम्ही जर्मन तंत्रज्ञानाला डिजिटल सुलभतेशी जोडतो.',
  story: 'Founded with a mission to eliminate print complexity, Maza Printwala empowers brands, creative agencies, and growing startups across India with world-class printing solutions.\n\nOver the years, we have invested continuously in high-precision Heidelberg offset presses, digital foil and spot-UV finishing stations, and direct-to-garment apparel printing facilities.\n\nWhether you need 100 luxury tactile visiting cards or 50,000 corrugated packaging boxes delivered across multiple branch offices, our manual quality inspection and calibrated color management ensure complete satisfaction.',
  story_hi: 'Maza Printwala की शुरुआत एक स्पष्ट उद्देश्य के साथ हुई: भारत के हर छोटे-बड़े व्यवसाय, डिज़ाइन एजेंसी और उद्यम को बिना किसी रुकावट के अंतरराष्ट्रीय स्तर की मुद्रण सेवा उपलब्ध कराना।\n\nवर्षों में हमने आधुनिक 4-कलर और 6-कलर ऑफ़सेट मशीनों, डिजिटल फ़ॉइल और स्पॉट यूवी स्टेशनों और अत्याधुनिक डायरेक्ट-टू-गारमेंट सेटअप में निवेश किया है।\n\nआज चाहे आपको 100 विलासी बिजनेस कार्ड चाहिए हों या 50,000 कॉर्पोरेट पैकेजिंग बॉक्स, हमारी समर्पित टीम रंग सटीकता, समय पर डिलीवरी और पारदर्शी फैक्ट्री दरों की गारंटी देती है।',
  story_mr: 'Maza Printwala ची स्थापना एका स्पष्ट उद्दिष्टाने झाली: भारतातील प्रत्येक व्यवसाय, डिझायनर आणि उद्योगाला आंतरराष्ट्रीय दर्जाची छपाई सेवा सहज उपलब्ध करून देणे.\n\nवर्षानुवर्षे आम्ही आधुनिक ऑफसेट मशिन्स, डिजिटल फॉइल आणि स्पॉट यूव्ही, तसेच अत्याधुनिक डायरेक्ट-टू-गारमेंट युनिट्समध्ये गुंतवणूक केली आहे.\n\nआज तुम्हाला 100 लक्झरी बिझनेस कार्ड्स हवे असोत किंवा 50,000 कॉर्पोरेट बॉक्स, आमची टीम रंग अचूकता आणि वेळेवर वितरणाची खात्री देते.',
  storyImage: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262678/maaza-printwala/images/cat_visiting_cards_new_1785478123231.jpg',
  stats: [
    { value: '50,000+', label: 'Happy Clients' },
    { value: '1.2M+', label: 'Orders Shipped' },
    { value: '99.8%', label: 'Quality SLA' },
    { value: '25,000+', label: 'Pin Codes Covered' },
  ],
  values: [
    { title: 'Industrial Precision', desc: 'Imported 400+ GSM art cards, calibrated CMYK color curves, and automated die-cutting.' },
    { title: 'Direct Factory Rates', desc: 'Transparent wholesale pricing with no middlemen markups and automated B2B GST invoicing.' },
    { title: 'Fast Pan-India Logistics', desc: 'Insured, door-step delivery across 25,000+ pin codes with live GPS tracking updates.' },
  ],
};

const DEFAULT_BULK_ENQUIRY = {
  badge: 'B2B & Corporate Printing',
  badge_hi: 'B2B और कॉर्पोरेट प्रिंटिंग',
  badge_mr: 'B2B आणि कॉर्पोरेट छपाई',
  title: 'Volume Printing & Custom Bulk Quotes',
  title_hi: 'थोक मुद्रण एवं कस्टम कॉर्पोरेट कोट्स',
  title_mr: 'मोठ्या प्रमाणावर छपाई आणि सानुकूल कोट्स',
  subtitle: 'Need 1,000+ units, custom dies, bespoke packaging, or unified branch stationery? Get direct factory rates and dedicated account management.',
  subtitle_hi: '1,000+ यूनिट्स, कस्टम डाईज, पैकेजिंग या ब्रांच स्टेशनरी की आवश्यकता है? डायरेक्ट फैक्ट्री दरें और समर्पित खाता प्रबंधन प्राप्त करें।',
  subtitle_mr: '1,000+ युनिट्स, सानुकूल डाइज किंवा ब्रँच स्टेशनरी हवी आहे? थेट फॅक्टरी दर आणि समर्पित मॅनेजर मिळवा.',
  guarantee: '🔒 Strictly confidential. We never share enterprise artwork or contact data.',
  guarantee_hi: '🔒 पूर्णतः गोपनीय। हम आपका व्यावसायिक आर्टवर्क या संपर्क डेटा कभी साझा नहीं करते।',
  guarantee_mr: '🔒 पूर्णपणे गोपनीय. आम्ही तुमची कलाकृती किंवा संपर्क डेटा कधीही शेअर करत नाही.',
  buttonText: 'Submit Commercial Quote',
  buttonText_hi: 'व्यावसायिक कोटेशन सबमिट करें',
  buttonText_mr: 'व्यावसायिक कोटेशन सादर करा',
  benefits: [
    { title: 'Wholesale Tier Rates', desc: 'Up to 45% discount on high volume enterprise contracts.', type: 'sparkles' },
    { title: 'Complimentary Proofing', desc: 'Physical hardcopy or digital press proof before full production run.', type: 'shield' },
    { title: '24h Turnaround SLA', desc: 'Dedicated print specialist responds with tailored quotation in 24 hours.', type: 'clock' },
  ],
};

const DEFAULT_PAGE_META = {
  home: {
    title: 'Maza Printwala | Online Printing Services & Custom Merchandise India',
    title_hi: 'Maza Printwala | ऑनलाइन प्रिंटिंग सेवाएं और कस्टम मर्चेंडाइज',
    title_mr: 'Maza Printwala | ऑनलाइन प्रिंटिंग सेवा आणि सानुकूल उत्पादने',
    description: 'Order custom business cards, t-shirts, packaging boxes, mugs, and corporate stationery online with fast Pan-India delivery.',
    description_hi: 'विजिटिंग कार्ड, टी-शर्ट, पैकेजिंग बॉक्स, मग और कॉर्पोरेट स्टेशनरी ऑनलाइन ऑर्डर करें तेज अखिल भारतीय डिलीवरी के साथ।',
    description_mr: 'व्हिजिटिंग कार्ड, टी-शर्ट, पॅकेजिंग बॉक्सेस, मग आणि स्टेशनरी ऑनलाइन ऑर्डर करा जलद अखिल भारतीय डिलिव्हरीसह.',
    keywords: 'printing services, visiting cards, custom tshirts, mug printing, packaging boxes, mumbai print',
    keywords_hi: 'प्रिंटिंग सेवाएं, विजिटिंग कार्ड, कस्टम टीशर्ट, मग प्रिंटिंग, पैकेजिंग बॉक्स',
    keywords_mr: 'प्रिंटिंग सेवा, व्हिजिटिंग कार्ड, सानुकूल टीशर्ट, मग प्रिंटिंग, पॅकेजिंग बॉक्स',
    ogImage: '',
  },
  about: {
    title: 'About Us | Maza Printwala - Crafting Quality Prints Since 2018',
    title_hi: 'हमारे बारे में | Maza Printwala - 2018 से गुणवत्तापूर्ण मुद्रण',
    title_mr: 'आमच्याबद्दल | Maza Printwala - 2018 पासून दर्जेदार छपाई',
    description: 'Learn about Maza Printwala print manufacturing, Heidelberg press infrastructure, and B2B corporate print capabilities.',
    description_hi: 'Maza Printwala की प्रिंट निर्माण क्षमता, हाइडेलबर्ग प्रेस इंफ्रास्ट्रक्चर और B2B कॉर्पोरेट प्रिंट समाधानों के बारे में जानें।',
    description_mr: 'Maza Printwala ची छपाई क्षमता, हायडेलबर्ग प्रेस पायाभूत सुविधा आणि B2B कॉर्पोरेट प्रिंट सोल्यूशन्सबद्दल जाणून घ्या.',
    keywords: 'about maza printwala, print factory mumbai, offset printing india',
    keywords_hi: 'माझा प्रिंटवाला, प्रिंट फैक्ट्री मुंबई, ऑफसेट प्रिंटिंग भारत',
    keywords_mr: 'माझा प्रिंटवाला, प्रिंट फॅक्टरी मुंबई, ऑफसेट प्रिंटिंग भारत',
    ogImage: '',
  },
  bulk: {
    title: 'B2B Volume & Bulk Printing Quotes | Maza Printwala',
    title_hi: 'B2B थोक प्रिंटिंग कोट्स | Maza Printwala',
    title_mr: 'B2B मोठ्या प्रमाणावर छपाई कोट्स | Maza Printwala',
    description: 'Get factory-direct wholesale quotes for volume printing orders above 1,000 units with dedicated GST invoicing.',
    description_hi: '1,000 से अधिक यूनिट्स के वॉल्यूम प्रिंटिंग ऑर्डर्स के लिए समर्पित GST इनवॉइसिंग के साथ डायरेक्ट फैक्ट्री कोट्स प्राप्त करें।',
    description_mr: '1,000 पेक्षा जास्त युनिट्सच्या मोठ्या ऑर्डर्ससाठी समर्पित GST इनव्हॉइसिंगसह थेट फॅक्टरी कोट्स मिळवा.',
    keywords: 'bulk printing, wholesale visiting cards, b2b print orders, corporate gifts bulk',
    keywords_hi: 'थोक प्रिंटिंग, व्यावसायिक विजिटिंग कार्ड, कॉर्पोरेट गिफ्ट्स थोक',
    keywords_mr: 'मोठ्या प्रमाणावर छपाई, व्हिजिटिंग कार्ड्स, कॉर्पोरेट भेटवस्तू',
    ogImage: '',
  },
  policies: {
    title: 'Policies & Customer Service | Maza Printwala',
    title_hi: 'नीतियां और ग्राहक सेवा | Maza Printwala',
    title_mr: 'धोरणे आणि ग्राहक सेवा | Maza Printwala',
    description: 'Review our shipping terms, reprint guarantees, privacy protection, and terms of service.',
    description_hi: 'हमारी शिपिंग शर्तें, पुनर्मुद्रण गारंटी, गोपनीयता सुरक्षा और सेवा की शर्तें पढ़ें।',
    description_mr: 'आमच्या शिपिंग अटी, पुनर्छपाई हमी, गोपनीयता संरक्षण आणि सेवा अटी तपासा.',
    keywords: 'printwala policies, terms of service, shipping policy, privacy',
    keywords_hi: 'प्रिंटवाला नीतियां, सेवा की शर्तें, शिपिंग नीति, गोपनीयता',
    keywords_mr: 'प्रिंटवाला धोरणे, सेवा अटी, शिपिंग धोरण, गोपनीयता',
    ogImage: '',
  },
};

const DEFAULT_NAVIGATION_MENU = {
  orderedSlugs: [
    'visiting-cards',
    'stationery',
    'custom-apparel',
    'marketing-materials',
    'packaging-boxes',
    'corporate-gifts',
    'photo-gifts',
    'stickers-labels',
  ],
  hiddenSlugs: [],
  labels: {},
  customLinks: [
    {
      label: 'Bulk Enquiry',
      label_hi: 'थोक पूछताछ',
      label_mr: 'मोठी मागणी',
      href: '/bulk-enquiry',
      badge: 'Hot',
      badge_hi: 'हॉट',
      badge_mr: 'हॉट',
      enabled: true,
    },
    {
      label: 'About Us',
      label_hi: 'हमारे बारे में',
      label_mr: 'आमच्याबद्दल',
      href: '/about',
      badge: '',
      badge_hi: '',
      badge_mr: '',
      enabled: true,
    },
  ],
};

const LocaleSelector = ({ current, onChange }) => (
  <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border)] shrink-0">
    {[
      { code: 'en', label: 'EN' },
      { code: 'hi', label: 'हिंदी' },
      { code: 'mr', label: 'मराठी' },
    ].map((l) => (
      <button
        key={l.code}
        type="button"
        onClick={() => onChange(l.code)}
        className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
          current === l.code
            ? 'bg-[#0082CA] text-white shadow-xs'
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
        }`}
      >
        {l.label}
      </button>
    ))}
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = 'text', help }) => (
  <div>
    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
    />
    {help && <p className="text-[11px] text-[var(--text-muted)] mt-1">{help}</p>}
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4, help }) => (
  <div>
    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">{label}</label>
    <textarea
      rows={rows}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
    />
    {help && <p className="text-[11px] text-[var(--text-muted)] mt-1">{help}</p>}
  </div>
);

// One-Click Image Upload Field with Direct Cloudinary Integration
const ImageField = ({ label, value, onChange, placeholder, help }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'maaza-printwala/cms');
    setIsUploading(true);
    try {
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data?.url || res.url || res.data?.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'https://res.cloudinary.com/... or click Upload'}
          className="flex-1 px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 neu-flat rounded-lg font-bold text-xs flex items-center gap-1.5 text-[#0082CA] hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={getImageUrl(value)}
            alt="Preview"
            className="w-12 h-12 object-cover rounded-md border border-[var(--border)] shadow-xs"
          />
          <span className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">{value}</span>
        </div>
      )}
      {help && <p className="text-[11px] text-[var(--text-muted)] mt-1">{help}</p>}
    </div>
  );
};

const ICON_OPTIONS = [
  'ShieldCheck',
  'Truck',
  'Sparkles',
  'Headphones',
  'Clock',
  'Star',
  'Zap',
  'CreditCard',
  'CheckCircle',
];

export default function CMSPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('hero');

  // CMS States
  const [heroSlides, setHeroSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categoryBlocks, setCategoryBlocks] = useState(DEFAULT_CATEGORY_BLOCKS);
  const [homeHeadings, setHomeHeadings] = useState(DEFAULT_HOME_HEADINGS);
  const [offerStrip, setOfferStrip] = useState(DEFAULT_OFFER_STRIP);
  const [trustItems, setTrustItems] = useState(DEFAULT_TRUST_ITEMS);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);
  const [footer, setFooter] = useState(DEFAULT_FOOTER);
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [activePolicyKey, setActivePolicyKey] = useState('privacy');
  const [aboutPage, setAboutPage] = useState(DEFAULT_ABOUT_PAGE);
  const [bulkEnquiry, setBulkEnquiry] = useState(DEFAULT_BULK_ENQUIRY);
  const [pageMeta, setPageMeta] = useState(DEFAULT_PAGE_META);
  const [activeMetaPage, setActiveMetaPage] = useState('home');
  const [navMenu, setNavMenu] = useState(DEFAULT_NAVIGATION_MENU);
  const [faqLocale, setFaqLocale] = useState('en');
  const [policyLocale, setPolicyLocale] = useState('en');
  const [aboutLocale, setAboutLocale] = useState('en');
  const [bulkLocale, setBulkLocale] = useState('en');
  const [headingsLocale, setHeadingsLocale] = useState('en');
  const [categoriesLocale, setCategoriesLocale] = useState('en');
  const [contactLocale, setContactLocale] = useState('en');
  const [offerLocale, setOfferLocale] = useState('en');
  const [menuLocale, setMenuLocale] = useState('en');
  const [seoLocale, setSeoLocale] = useState('en');
  const [paymentLocale, setPaymentLocale] = useState('en');

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['cms-homepage'],
    queryFn: () => axiosInstance.get('/cms/homepage?all=true'),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () => axiosInstance.get('/categories'),
  });
  const allCategories = Array.isArray(catData?.data)
    ? catData.data
    : catData?.data?.categories || catData?.data?.data || [];

  useEffect(() => {
    const content = Array.isArray(data?.data?.content) ? data.data.content : [];

    // 1. Hero
    const heroContent = content.find((c) => c.key === 'homepage_hero');
    if (heroContent?.content?.slides?.length) {
      setHeroSlides(heroContent.content.slides);
    } else {
      setHeroSlides((prev) => (prev.length ? prev : [EMPTY_SLIDE]));
    }

    // 2. Promotional Banners
    const bannersContent = content.find((c) => c.key === 'homepage_banners');
    if (bannersContent?.content?.banners?.length) {
      setBanners(bannersContent.content.banners);
    }

    // 3. Category Tiles
    const catContent = content.find((c) => c.key === 'homepage_categories');
    if (catContent?.content?.blocks?.length) {
      setCategoryBlocks(catContent.content.blocks);
    }

    // 4. Section Headings
    const headingsContent = content.find((c) => c.key === 'homepage_headings');
    if (headingsContent?.content) {
      setHomeHeadings({ ...DEFAULT_HOME_HEADINGS, ...headingsContent.content });
    }

    // 5. Offer Strip
    const offerContent = content.find((c) => c.key === 'offer_strip');
    if (offerContent?.content) {
      setOfferStrip({ ...DEFAULT_OFFER_STRIP, ...offerContent.content, isActive: offerContent.isActive ?? offerContent.content.isActive });
    }

    // 6. Trust Strip
    const trustContent = content.find((c) => c.key === 'homepage_trust');
    if (trustContent?.content?.items?.length) {
      setTrustItems(trustContent.content.items);
    }

    // 7. FAQ
    const faqContent = content.find((c) => c.key === 'homepage_faq');
    if (faqContent?.content?.items?.length) {
      setFaqs(faqContent.content.items);
    }

    // 8. Contact Info
    const contactContent = content.find((c) => c.key === 'contact_info');
    if (contactContent?.content) {
      setContactInfo({ ...DEFAULT_CONTACT, ...contactContent.content });
    }

    // 9. Footer Links & Payments
    const footerContent = content.find((c) => c.key === 'footer_links');
    if (footerContent?.content) {
      setFooter({ ...DEFAULT_FOOTER, ...footerContent.content });
    }

    const paymentContent = content.find((c) => c.key === 'payment_strip');
    if (paymentContent?.content) {
      setPayments({ ...DEFAULT_PAYMENTS, ...paymentContent.content });
    }

    // 10. Policies
    const privacyContent = content.find((c) => c.key === 'policy_privacy');
    const termsContent = content.find((c) => c.key === 'policy_terms');
    const shippingContent = content.find((c) => c.key === 'policy_shipping');
    const returnsContent = content.find((c) => c.key === 'policy_returns');

    setPolicies((prev) => ({
      privacy: privacyContent?.content ? { ...prev.privacy, ...privacyContent.content } : prev.privacy,
      terms: termsContent?.content ? { ...prev.terms, ...termsContent.content } : prev.terms,
      shipping: shippingContent?.content ? { ...prev.shipping, ...shippingContent.content } : prev.shipping,
      returns: returnsContent?.content ? { ...prev.returns, ...returnsContent.content } : prev.returns,
    }));

    // 11. About Page
    const aboutContent = content.find((c) => c.key === 'about_page');
    if (aboutContent?.content) {
      setAboutPage((prev) => ({ ...prev, ...aboutContent.content }));
    }

    // 12. Bulk Enquiry
    const bulkContent = content.find((c) => c.key === 'bulk_enquiry');
    if (bulkContent?.content) {
      setBulkEnquiry((prev) => ({ ...prev, ...bulkContent.content }));
    }

    // 13. Page Meta
    const metaContent = content.find((c) => c.key === 'page_meta');
    if (metaContent?.content) {
      setPageMeta((prev) => ({ ...prev, ...metaContent.content }));
    }

    // 14. Navigation Menu
    const menuContent = content.find((c) => c.key === 'navigation_menu');
    if (menuContent?.content) {
      setNavMenu((prev) => ({ ...prev, ...menuContent.content }));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload) => axiosInstance.put('/cms/homepage', payload),
    onSuccess: (_res, payload) => {
      queryClient.invalidateQueries({ queryKey: ['cms-homepage'] });
      alert(`${payload.title || 'CMS Content'} saved successfully!`);
    },
    onError: () => alert('Failed to save CMS content'),
  });

  // ---------- Save Handlers ----------
  const saveHero = () =>
    saveMutation.mutate({
      key: 'homepage_hero',
      section: 'HERO',
      title: 'Hero Slider',
      content: { slides: heroSlides },
      isActive: true,
      sortOrder: 1,
    });

  const saveBanners = () =>
    saveMutation.mutate({
      key: 'homepage_banners',
      section: 'BANNERS',
      title: 'Promotional Banners',
      content: { banners },
      isActive: true,
      sortOrder: 2,
    });

  const saveCategoryTiles = () =>
    saveMutation.mutate({
      key: 'homepage_categories',
      section: 'BANNERS',
      title: 'Category Tiles',
      content: { blocks: categoryBlocks },
      isActive: true,
      sortOrder: 3,
    });

  const saveHeadings = () =>
    saveMutation.mutate({
      key: 'homepage_headings',
      section: 'HERO',
      title: 'Home Section Headings',
      content: homeHeadings,
      isActive: true,
      sortOrder: 4,
    });

  const saveOfferStrip = () =>
    saveMutation.mutate({
      key: 'offer_strip',
      section: 'BANNERS',
      title: 'Announcement / Offer Strip',
      content: offerStrip,
      isActive: Boolean(offerStrip.isActive),
      sortOrder: 0,
    });

  const saveTrustStrip = () =>
    saveMutation.mutate({
      key: 'homepage_trust',
      section: 'HERO',
      title: 'Homepage Trust Strip',
      content: { items: trustItems },
      isActive: true,
      sortOrder: 5,
    });

  const saveFaqs = () =>
    saveMutation.mutate({
      key: 'homepage_faq',
      section: 'FAQ',
      title: 'Frequently Asked Questions',
      content: { items: faqs },
      isActive: true,
      sortOrder: 6,
    });

  const saveContactInfo = () =>
    saveMutation.mutate({
      key: 'contact_info',
      section: 'CONTACT_INFO',
      title: 'Store Contact Information',
      content: contactInfo,
      isActive: true,
      sortOrder: 7,
    });

  const saveFooter = () => {
    saveMutation.mutate({
      key: 'footer_links',
      section: 'FOOTER',
      title: 'Footer Links',
      content: footer,
      isActive: true,
      sortOrder: 8,
    });
    saveMutation.mutate({
      key: 'payment_strip',
      section: 'FOOTER',
      title: 'Payment Strip Badges',
      content: payments,
      isActive: true,
      sortOrder: 9,
    });
  };

  const savePolicy = (policyKey) => {
    const keyMap = {
      privacy: { key: 'policy_privacy', title: 'Privacy & Cookie Policy' },
      terms: { key: 'policy_terms', title: 'Terms of Service' },
      shipping: { key: 'policy_shipping', title: 'Shipping & Delivery Policy' },
      returns: { key: 'policy_returns', title: 'Return & Cancellation Policy' },
    };
    const meta = keyMap[policyKey];
    saveMutation.mutate({
      key: meta.key,
      section: 'POLICY',
      title: meta.title,
      content: policies[policyKey],
      isActive: true,
      sortOrder: 10,
    });
  };

  const saveAboutPage = () =>
    saveMutation.mutate({
      key: 'about_page',
      section: 'ABOUT',
      title: 'About Us Page Content',
      content: aboutPage,
      isActive: true,
      sortOrder: 11,
    });

  const saveBulkEnquiry = () =>
    saveMutation.mutate({
      key: 'bulk_enquiry',
      section: 'BULK_ENQUIRY',
      title: 'Bulk Enquiry Page Copy',
      content: bulkEnquiry,
      isActive: true,
      sortOrder: 12,
    });

  const savePageMeta = () =>
    saveMutation.mutate({
      key: 'page_meta',
      section: 'SEO',
      title: 'Page SEO Metadata & OG Tags',
      content: pageMeta,
      isActive: true,
      sortOrder: 13,
    });

  const saveNavMenu = () =>
    saveMutation.mutate({
      key: 'navigation_menu',
      section: 'MENU',
      title: 'Navigation & Mega Menu Ordering',
      content: navMenu,
      isActive: true,
      sortOrder: 14,
    });

  // ---------- Helpers ----------
  const updateSlide = (index, field, value) => {
    const next = [...heroSlides];
    next[index] = { ...next[index], [field]: value };
    setHeroSlides(next);
  };
  const addSlide = () => setHeroSlides([...heroSlides, { ...EMPTY_SLIDE }]);
  const removeSlide = (index) => setHeroSlides(heroSlides.filter((_, i) => i !== index));

  const updateBanner = (index, field, value) => {
    const next = [...banners];
    next[index] = { ...next[index], [field]: value };
    setBanners(next);
  };
  const addBanner = () => setBanners([...banners, { ...EMPTY_BANNER }]);
  const removeBanner = (index) => setBanners(banners.filter((_, i) => i !== index));

  // Category Blocks Helpers
  const updateBlockTitle = (bi, title, field = 'title') => {
    const next = [...categoryBlocks];
    next[bi] = { ...next[bi], [field]: title };
    setCategoryBlocks(next);
  };
  const addBlock = () => {
    setCategoryBlocks([...categoryBlocks, { title: 'New Category Block', tiles: [] }]);
  };
  const removeBlock = (bi) => {
    setCategoryBlocks(categoryBlocks.filter((_, i) => i !== bi));
  };
  const updateTile = (bi, ti, field, value) => {
    const next = [...categoryBlocks];
    const tiles = [...next[bi].tiles];
    tiles[ti] = { ...tiles[ti], [field]: value };
    next[bi] = { ...next[bi], tiles };
    setCategoryBlocks(next);
  };
  const addTile = (bi) => {
    const next = [...categoryBlocks];
    next[bi] = {
      ...next[bi],
      tiles: [...next[bi].tiles, { name: 'New Category', img: '', link: '/products', isActive: true }],
    };
    setCategoryBlocks(next);
  };
  const removeTile = (bi, ti) => {
    const next = [...categoryBlocks];
    next[bi] = {
      ...next[bi],
      tiles: next[bi].tiles.filter((_, i) => i !== ti),
    };
    setCategoryBlocks(next);
  };

  // Trust Strip Helpers
  const updateTrust = (index, field, value) => {
    const next = [...trustItems];
    next[index] = { ...next[index], [field]: value };
    setTrustItems(next);
  };
  const addTrust = () =>
    setTrustItems([...trustItems, { icon: 'ShieldCheck', title: 'New Trust Item', description: '', isActive: true }]);
  const removeTrust = (index) => setTrustItems(trustItems.filter((_, i) => i !== index));

  // FAQ Helpers
  const updateFaq = (index, field, value) => {
    const next = [...faqs];
    next[index] = { ...next[index], [field]: value };
    setFaqs(next);
  };
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '', isActive: true }]);
  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
  const moveFaq = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setFaqs(next);
  };

  // Footer & Payment Helpers
  const setFooterField = (field, value) => setFooter({ ...footer, [field]: value });
  const setSocial = (network, value) =>
    setFooter({ ...footer, social: { ...(footer.social || {}), [network]: value } });

  const togglePaymentBadge = (id) => {
    const nextBadges = (payments.badges || []).map((b) =>
      b.id === id ? { ...b, enabled: !b.enabled } : b
    );
    setPayments({ ...payments, badges: nextBadges });
  };

  const updateColumn = (ci, field, value) => {
    const next = [...footer.columns];
    next[ci] = { ...next[ci], [field]: value };
    setFooter({ ...footer, columns: next });
  };
  const addColumn = () => setFooter({ ...footer, columns: [...footer.columns, { ...EMPTY_COLUMN }] });
  const removeColumn = (ci) =>
    setFooter({ ...footer, columns: footer.columns.filter((_, i) => i !== ci) });

  const updateLink = (ci, li, field, value) => {
    const next = [...footer.columns];
    const links = [...next[ci].links];
    links[li] = { ...links[li], [field]: value };
    next[ci] = { ...next[ci], links };
    setFooter({ ...footer, columns: next });
  };
  const addLink = (ci) => {
    const next = [...footer.columns];
    next[ci] = { ...next[ci], links: [...next[ci].links, { label: '', href: '' }] };
    setFooter({ ...footer, columns: next });
  };
  const removeLink = (ci, li) => {
    const next = [...footer.columns];
    next[ci] = { ...next[ci], links: next[ci].links.filter((_, i) => i !== li) };
    setFooter({ ...footer, columns: next });
  };

  const SaveButton = ({ onClick, label }) => (
    <div className="pt-6 flex justify-end">
      <button
        onClick={onClick}
        disabled={saveMutation.isPending}
        className="px-6 py-2.5 neu-btn text-[var(--text-main)] font-bold text-sm rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 cursor-pointer shadow-sm"
      >
        <Save className="w-4 h-4 text-[#0082CA]" /> {saveMutation.isPending ? 'Saving...' : label}
      </button>
    </div>
  );

  const tabClass = (tab) =>
    `w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-between cursor-pointer ${
      activeTab === tab
        ? 'neu-flat text-[#0082CA] font-extrabold'
        : 'text-[var(--text-muted)] hover:neu-flat/50 border-transparent'
    }`;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Content Management (CMS)</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Control live storefront text, promotional marketing cards, trust badges, FAQs, and policies without code deploys.
        </p>
      </div>

      <div className="neu-flat rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 neu-flat p-4 space-y-1.5 shrink-0 border-r border-[var(--border)]">
          <button onClick={() => setActiveTab('hero')} className={tabClass('hero')}>
            <span>Hero Slider</span>
          </button>
          <button onClick={() => setActiveTab('banners')} className={tabClass('banners')}>
            <span>Promotional Banners</span>
          </button>
          <button onClick={() => setActiveTab('offer')} className={tabClass('offer')}>
            <span>Announcement Strip</span>
          </button>
          <button onClick={() => setActiveTab('categories')} className={tabClass('categories')}>
            <span>Category Tiles</span>
          </button>
          <button onClick={() => setActiveTab('headings')} className={tabClass('headings')}>
            <span>Section Headings</span>
          </button>
          <button onClick={() => setActiveTab('trust')} className={tabClass('trust')}>
            <span>Trust Strip</span>
          </button>
          <button onClick={() => setActiveTab('faq')} className={tabClass('faq')}>
            <span>FAQ Manager</span>
          </button>
          <button onClick={() => setActiveTab('contact')} className={tabClass('contact')}>
            <span>Contact Details</span>
          </button>
          <button onClick={() => setActiveTab('footer')} className={tabClass('footer')}>
            <span>Footer & Payments</span>
          </button>
          <button onClick={() => setActiveTab('policies')} className={tabClass('policies')}>
            <span>Policies & Legal</span>
          </button>
          <button onClick={() => setActiveTab('about')} className={tabClass('about')}>
            <span>About Us Page</span>
          </button>
          <button onClick={() => setActiveTab('bulk_enquiry')} className={tabClass('bulk_enquiry')}>
            <span>Bulk Enquiry</span>
          </button>
          <button onClick={() => setActiveTab('seo')} className={tabClass('seo')}>
            <span>Page SEO & Meta</span>
          </button>
          <button onClick={() => setActiveTab('menu')} className={tabClass('menu')}>
            <span>Navigation Menu</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {isFetching ? (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
              Loading CMS Data...
            </div>
          ) : activeTab === 'hero' ? (
            /* TAB 1: HERO SLIDER */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Hero Slider</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    The first slide with both an image and a title replaces the default homepage banner. Use the Upload button to select an image from your device.
                  </p>
                </div>
                <button
                  onClick={addSlide}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {heroSlides.length === 0 && (
                  <div className="neu-flat rounded-xl p-10 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-3 text-[var(--text-faint)]" />
                    <p className="text-sm font-bold text-[var(--text-main)]">No hero slide yet</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
                      The homepage is showing its built-in banner. Add a slide with an image and a
                      title to replace it.
                    </p>
                    <button
                      onClick={addSlide}
                      className="mt-4 px-4 py-2 neu-flat text-[#0082CA] font-bold text-xs rounded-lg inline-flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add your first slide
                    </button>
                  </div>
                )}
                {heroSlides.map((slide, index) => (
                  <div key={index} className="neu-flat rounded-xl p-4 flex gap-4 group">
                    <div className="cursor-move pt-2 text-[var(--text-faint)]">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 neu-flat rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative bg-[var(--bg-subtle)]">
                          {slide.image ? (
                            <img src={getImageUrl(slide.image)} className="w-full h-full object-cover" alt="slide" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-[var(--text-faint)]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <ImageField
                            label="Slide Image"
                            value={slide.image}
                            onChange={(v) => updateSlide(index, 'image', v)}
                            placeholder="https://res.cloudinary.com/... or click Upload"
                            help="Cloudinary direct image URL or upload image directly"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Title" value={slide.title} onChange={(v) => updateSlide(index, 'title', v)} />
                        <Field label="Subtitle" value={slide.subtitle} onChange={(v) => updateSlide(index, 'subtitle', v)} />
                        <Field label="CTA Text" value={slide.ctaText} onChange={(v) => updateSlide(index, 'ctaText', v)} />
                        <Field label="CTA Link" value={slide.ctaLink} onChange={(v) => updateSlide(index, 'ctaLink', v)} placeholder="/products" />
                      </div>
                    </div>
                    <button
                      onClick={() => removeSlide(index)}
                      className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveHero} label="Save Hero Slider" />
            </div>
          ) : activeTab === 'banners' ? (
            /* TAB 2: PROMOTIONAL BANNERS */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Promotional Banners</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Rendered directly under the hero on the storefront homepage. Leave list empty to hide section.
                  </p>
                </div>
                <button
                  onClick={addBanner}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Banner
                </button>
              </div>

              {banners.length === 0 ? (
                <div className="neu-flat rounded-xl p-10 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-3 text-[var(--text-faint)]" />
                  <p className="text-sm font-bold text-[var(--text-main)]">No banners yet</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Add a banner to show promotional cards under the hero banner.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner, index) => (
                    <div key={index} className="neu-flat rounded-xl p-4 flex gap-4 group">
                      <div className="cursor-move pt-2 text-[var(--text-faint)]">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex gap-4">
                          <div className="w-32 h-20 neu-flat rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative bg-[var(--bg-subtle)]">
                            {banner.image ? (
                              <img src={getImageUrl(banner.image)} className="w-full h-full object-cover" alt="banner" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-[var(--text-faint)]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <ImageField
                              label="Banner Image"
                              value={banner.image}
                              onChange={(v) => updateBanner(index, 'image', v)}
                              placeholder="https://res.cloudinary.com/... or click Upload"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Badge (pill above title)" value={banner.badge} onChange={(v) => updateBanner(index, 'badge', v)} placeholder="e.g. Limited Offer" />
                          <Field label="Title" value={banner.title} onChange={(v) => updateBanner(index, 'title', v)} placeholder="e.g. Flat 40% OFF" />
                          <Field label="Subtitle" value={banner.subtitle} onChange={(v) => updateBanner(index, 'subtitle', v)} placeholder="e.g. Valid on bulk corporate orders" />
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="CTA Text" value={banner.ctaText} onChange={(v) => updateBanner(index, 'ctaText', v)} placeholder="Claim Offer" />
                            <Field label="CTA Link" value={banner.ctaLink} onChange={(v) => updateBanner(index, 'ctaLink', v)} placeholder="/products" />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBanner(index)}
                        className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <SaveButton onClick={saveBanners} label="Save Promotional Banners" />
            </div>
          ) : activeTab === 'offer' ? (
            /* TAB 3: ANNOUNCEMENT / OFFER STRIP */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Announcement / Offer Strip</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Appears at the very top of the storefront above the main header. Dismissible per browser session.
                  </p>
                </div>
                <LocaleSelector current={offerLocale} onChange={setOfferLocale} />
              </div>

              {(() => {
                const textKey = offerLocale === 'hi' ? 'text_hi' : offerLocale === 'mr' ? 'text_mr' : 'text';
                const badgeKey = offerLocale === 'hi' ? 'badge_hi' : offerLocale === 'mr' ? 'badge_mr' : 'badge';
                const linkKey = offerLocale === 'hi' ? 'linkLabel_hi' : offerLocale === 'mr' ? 'linkLabel_mr' : 'linkLabel';
                const langLabel = offerLocale === 'hi' ? 'Hindi (हिंदी)' : offerLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                return (
                  <div className="neu-flat rounded-xl p-6 space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                      <div>
                        <label className="text-sm font-bold text-[var(--text-main)] block">Strip Visibility</label>
                        <p className="text-xs text-[var(--text-muted)]">Toggle this to show or hide the announcement bar across the site.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(offerStrip.isActive)}
                        onChange={(e) => setOfferStrip({ ...offerStrip, isActive: e.target.checked })}
                        className="w-5 h-5 accent-[#0082CA] rounded cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={`Badge Text (${langLabel})`}
                        value={offerStrip[badgeKey] || ''}
                        onChange={(v) => setOfferStrip({ ...offerStrip, [badgeKey]: v })}
                        placeholder="e.g. SPECIAL OFFER, FLASH SALE"
                      />
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Color Theme</label>
                        <select
                          value={offerStrip.bgStyle || 'blue'}
                          onChange={(e) => setOfferStrip({ ...offerStrip, bgStyle: e.target.value })}
                          className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
                        >
                          <option value="blue">Blue / Brand Primary</option>
                          <option value="dark">Midnight Dark (Slate 900)</option>
                          <option value="amber">Warm Amber Gold</option>
                          <option value="emerald">Emerald Green</option>
                          <option value="crimson">Crimson Red</option>
                        </select>
                      </div>
                    </div>

                    <Field
                      label={`Announcement Message (${langLabel})`}
                      value={offerStrip[textKey] || ''}
                      onChange={(v) => setOfferStrip({ ...offerStrip, [textKey]: v })}
                      placeholder="e.g. Flat 40% OFF on all Bulk Orders | Free Pan-India Delivery"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={`Link Button Text (${langLabel})`}
                        value={offerStrip[linkKey] || ''}
                        onChange={(v) => setOfferStrip({ ...offerStrip, [linkKey]: v })}
                        placeholder="e.g. Order Now, Shop Deals"
                      />
                      <Field
                        label="Link Target URL"
                        value={offerStrip.linkTarget}
                        onChange={(v) => setOfferStrip({ ...offerStrip, linkTarget: v })}
                        placeholder="/products or https://..."
                      />
                    </div>
                  </div>
                );
              })()}

              <SaveButton onClick={saveOfferStrip} label="Save Announcement Strip" />
            </div>
          ) : activeTab === 'categories' ? (
            /* TAB 4: CATEGORY TILES (VISUAL CATEGORIES) */
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Homepage Category Tiles</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Customize the 2-block square visual category tiles (Business Essentials, Custom Apparel, etc.) on the homepage.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <LocaleSelector current={categoriesLocale} onChange={setCategoriesLocale} />
                  <button
                    onClick={addBlock}
                    className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Category Block
                  </button>
                </div>
              </div>

              {(() => {
                const titleKey = categoriesLocale === 'hi' ? 'title_hi' : categoriesLocale === 'mr' ? 'title_mr' : 'title';
                const nameKey = categoriesLocale === 'hi' ? 'name_hi' : categoriesLocale === 'mr' ? 'name_mr' : 'name';
                const langLabel = categoriesLocale === 'hi' ? 'Hindi (हिंदी)' : categoriesLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                return (
                  <div className="space-y-8">
                    {categoryBlocks.map((block, bi) => (
                      <div key={bi} className="neu-flat rounded-2xl p-6 space-y-5 border border-[var(--border)]">
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                          <div className="flex-1 max-w-md">
                            <Field
                              label={`Block ${bi + 1} Heading (${langLabel})`}
                              value={block[titleKey] || ''}
                              onChange={(v) => updateBlockTitle(bi, v, titleKey)}
                              placeholder="e.g. Business Essentials"
                            />
                          </div>
                          <div className="flex items-center gap-3 pt-4">
                            <button
                              onClick={() => addTile(bi)}
                              className="px-3 py-1.5 neu-flat text-xs font-bold text-[#0082CA] rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add Tile
                            </button>
                            <button
                              onClick={() => removeBlock(bi)}
                              className="p-1.5 text-[var(--text-faint)] hover:text-rose-600 rounded-lg cursor-pointer"
                              title="Delete Block"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(block.tiles || []).map((tile, ti) => (
                            <div key={ti} className="neu-flat rounded-xl p-4 space-y-3 relative group">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Tile #{ti + 1}</span>
                                <div className="flex items-center gap-2">
                                  <label className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={tile.isActive !== false}
                                      onChange={(e) => updateTile(bi, ti, 'isActive', e.target.checked)}
                                      className="accent-[#0082CA] rounded"
                                    />
                                    Active
                                  </label>
                                  <button
                                    onClick={() => removeTile(bi, ti)}
                                    className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <Field
                                label={`Tile Title / Label (${langLabel})`}
                                value={tile[nameKey] || ''}
                                onChange={(v) => updateTile(bi, ti, nameKey, v)}
                                placeholder="e.g. Visiting Cards"
                              />

                              <ImageField
                                label="Tile Image"
                                value={tile.img}
                                onChange={(v) => updateTile(bi, ti, 'img', v)}
                                placeholder="https://res.cloudinary.com/... or upload"
                              />

                              <Field
                                label="Target URL"
                                value={tile.link}
                                onChange={(v) => updateTile(bi, ti, 'link', v)}
                                placeholder="/visiting-cards or /products?search=..."
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <SaveButton onClick={saveCategoryTiles} label="Save Category Tiles" />
            </div>
          ) : activeTab === 'headings' ? (
            /* TAB 5: HOME SECTION HEADINGS */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Home Section Headings</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Customize the titles and subtitles rendered above each major storefront product section on the homepage.
                  </p>
                </div>
                <LocaleSelector current={headingsLocale} onChange={setHeadingsLocale} />
              </div>

              {(() => {
                const suffix = headingsLocale === 'hi' ? '_hi' : headingsLocale === 'mr' ? '_mr' : '';
                const langLabel = headingsLocale === 'hi' ? 'Hindi (हिंदी)' : headingsLocale === 'mr' ? 'Marathi (मराठी)' : 'English';
                const fKey = (name) => `${name}${suffix}`;

                return (
                  <div className="neu-flat rounded-xl p-6 space-y-6">
                    {/* Best Sellers */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Best Sellers Section</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          label={`Section Title (${langLabel})`}
                          value={homeHeadings[fKey('bestSellersTitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('bestSellersTitle')]: v })}
                          placeholder="Best Selling Products"
                        />
                        <Field
                          label={`Section Subtitle (${langLabel})`}
                          value={homeHeadings[fKey('bestSellersSubtitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('bestSellersSubtitle')]: v })}
                          placeholder="Most ordered commercial print and merchandise products"
                        />
                      </div>
                    </div>

                    {/* New Arrivals */}
                    <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">New Arrivals Section</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          label={`Section Title (${langLabel})`}
                          value={homeHeadings[fKey('newArrivalsTitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('newArrivalsTitle')]: v })}
                          placeholder="New Arrivals & Fresh Templates"
                        />
                        <Field
                          label={`Section Subtitle (${langLabel})`}
                          value={homeHeadings[fKey('newArrivalsSubtitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('newArrivalsSubtitle')]: v })}
                          placeholder="Fresh new templates and products"
                        />
                      </div>
                    </div>

                    {/* Corporate Essentials */}
                    <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Corporate & Business Printing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          label={`Section Title (${langLabel})`}
                          value={homeHeadings[fKey('corporateTitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('corporateTitle')]: v })}
                          placeholder="Corporate Essentials & Gifting"
                        />
                        <Field
                          label={`Section Subtitle (${langLabel})`}
                          value={homeHeadings[fKey('corporateSubtitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('corporateSubtitle')]: v })}
                          placeholder="Bulk corporate solutions with custom GST invoicing"
                        />
                      </div>
                    </div>

                    {/* Trending Products */}
                    <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Trending / Top Rated Section</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          label={`Section Title (${langLabel})`}
                          value={homeHeadings[fKey('trendingTitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('trendingTitle')]: v })}
                          placeholder="Trending Print Catalogue"
                        />
                        <Field
                          label={`Section Subtitle (${langLabel})`}
                          value={homeHeadings[fKey('trendingSubtitle')] || ''}
                          onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('trendingSubtitle')]: v })}
                          placeholder="Top rated commercial solutions popular this month"
                        />
                      </div>
                    </div>

                    {/* Popular Searches */}
                    <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Popular Searches Bar</h3>
                      <Field
                        label={`Section Title (${langLabel})`}
                        value={homeHeadings[fKey('popularSearchesTitle')] || ''}
                        onChange={(v) => setHomeHeadings({ ...homeHeadings, [fKey('popularSearchesTitle')]: v })}
                        placeholder="Popular Searches"
                      />
                    </div>
                  </div>
                );
              })()}

              <SaveButton onClick={saveHeadings} label="Save Section Headings" />
            </div>
          ) : activeTab === 'trust' ? (
            /* TAB 6: TRUST STRIP */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Trust Strip (Value Pillars)</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    The 4 icons and value statements that appear below the hero banner.
                  </p>
                </div>
                <button
                  onClick={addTrust}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {trustItems.map((item, index) => (
                  <div key={index} className="neu-flat rounded-xl p-5 space-y-4 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                        Pillar #{index + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(item.isActive !== false)}
                            onChange={(e) => updateTrust(index, 'isActive', e.target.checked)}
                            className="accent-[#0082CA] rounded cursor-pointer"
                          />
                          Active
                        </label>
                        <button
                          onClick={() => removeTrust(index)}
                          className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Icon</label>
                        <select
                          value={item.icon || 'ShieldCheck'}
                          onChange={(e) => updateTrust(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <Field
                          label="Title"
                          value={item.title}
                          onChange={(v) => updateTrust(index, 'title', v)}
                          placeholder="e.g. Precision Colors"
                        />
                      </div>
                    </div>

                    <Field
                      label="Short Description"
                      value={item.description}
                      onChange={(v) => updateTrust(index, 'description', v)}
                      placeholder="e.g. CMYK calibrated offset & digital machines"
                    />
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveTrustStrip} label="Save Trust Strip" />
            </div>
          ) : activeTab === 'faq' ? (
            /* TAB 7: FAQ MANAGER */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">FAQ Manager</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Manage the accordion questions on the homepage. Drag reorder, toggle active, or localize into Hindi and Marathi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border)]">
                    {[
                      { code: 'en', label: 'EN' },
                      { code: 'hi', label: 'हिंदी' },
                      { code: 'mr', label: 'मराठी' },
                    ].map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setFaqLocale(l.code)}
                        className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                          faqLocale === l.code
                            ? 'bg-[#0082CA] text-white shadow-xs'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={addFaq}
                    className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Question
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const qKey = faqLocale === 'hi' ? 'question_hi' : faqLocale === 'mr' ? 'question_mr' : 'question';
                  const aKey = faqLocale === 'hi' ? 'answer_hi' : faqLocale === 'mr' ? 'answer_mr' : 'answer';
                  const langName = faqLocale === 'hi' ? 'Hindi (हिंदी)' : faqLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                  return (
                    <div key={index} className="neu-flat rounded-xl p-5 space-y-3 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                            Q{index + 1}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#0082CA]">
                            {langName}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveFaq(index, -1)}
                              className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === faqs.length - 1}
                              onClick={() => moveFaq(index, 1)}
                              className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(faq.isActive !== false)}
                              onChange={(e) => updateFaq(index, 'isActive', e.target.checked)}
                              className="accent-[#0082CA] rounded cursor-pointer"
                            />
                            Active
                          </label>
                          <button
                            onClick={() => removeFaq(index)}
                            className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <Field
                        label={`Question (${langName})`}
                        value={faq[qKey] || ''}
                        onChange={(v) => updateFaq(index, qKey, v)}
                        placeholder={`Question in ${langName}...`}
                      />

                      <TextAreaField
                        label={`Answer (${langName})`}
                        value={faq[aKey] || ''}
                        onChange={(v) => updateFaq(index, aKey, v)}
                        placeholder={`Detailed answer in ${langName}...`}
                        rows={3}
                      />
                    </div>
                  );
                })}
              </div>

              <SaveButton onClick={saveFaqs} label="Save FAQs" />
            </div>
          ) : activeTab === 'contact' ? (
            /* TAB 8: CONTACT DETAILS */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Store Contact Information</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Shared across Footer, Support Desk, Header mobile drawer, and customer notification receipts.
                  </p>
                </div>
                <LocaleSelector current={contactLocale} onChange={setContactLocale} />
              </div>

              {(() => {
                const suffix = contactLocale === 'hi' ? '_hi' : contactLocale === 'mr' ? '_mr' : '';
                const langLabel = contactLocale === 'hi' ? 'Hindi (हिंदी)' : contactLocale === 'mr' ? 'Marathi (मराठी)' : 'English';
                const cKey = (name) => `${name}${suffix}`;

                return (
                  <div className="neu-flat rounded-xl p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label="Customer Support Helpline (Calling)"
                        value={contactInfo.supportPhone}
                        onChange={(v) => setContactInfo({ ...contactInfo, supportPhone: v })}
                        placeholder="+91 7700054984"
                      />
                      <Field
                        label="WhatsApp Assistance Number"
                        value={contactInfo.whatsappNumber}
                        onChange={(v) => setContactInfo({ ...contactInfo, whatsappNumber: v })}
                        placeholder="+91 7700054984"
                      />
                      <Field
                        label="Support Email"
                        value={contactInfo.supportEmail}
                        onChange={(v) => setContactInfo({ ...contactInfo, supportEmail: v })}
                        placeholder="imagemazaprintwala@gmail.com"
                      />
                      <Field
                        label={`Working Hours Notice (${langLabel})`}
                        value={contactInfo[cKey('workingHours')] || ''}
                        onChange={(v) => setContactInfo({ ...contactInfo, [cKey('workingHours')]: v })}
                        placeholder="Mon - Sat: 10:00 AM - 7:00 PM"
                      />
                    </div>

                    <div>
                      <Field
                        label="GSTIN Number (for corporate billing)"
                        value={contactInfo.gstin}
                        onChange={(v) => setContactInfo({ ...contactInfo, gstin: v })}
                        placeholder="27AAAAA0000A1Z5"
                      />
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] pt-4 border-t border-[var(--border)]">
                      Physical Office & Dispatch Address ({langLabel})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={`Address Line 1 (${langLabel})`}
                        value={contactInfo[cKey('addressLine1')] || ''}
                        onChange={(v) => setContactInfo({ ...contactInfo, [cKey('addressLine1')]: v })}
                        placeholder="Shop/Unit No., Building Name"
                      />
                      <Field
                        label={`Address Line 2 (${langLabel})`}
                        value={contactInfo[cKey('addressLine2')] || ''}
                        onChange={(v) => setContactInfo({ ...contactInfo, [cKey('addressLine2')]: v })}
                        placeholder="Street, Landmark, Area"
                      />
                      <Field
                        label={`City (${langLabel})`}
                        value={contactInfo[cKey('city')] || ''}
                        onChange={(v) => setContactInfo({ ...contactInfo, [cKey('city')]: v })}
                        placeholder="Mumbai"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Field
                          label={`State (${langLabel})`}
                          value={contactInfo[cKey('state')] || ''}
                          onChange={(v) => setContactInfo({ ...contactInfo, [cKey('state')]: v })}
                          placeholder="Maharashtra"
                        />
                        <Field
                          label="PIN Code"
                          value={contactInfo.pincode}
                          onChange={(v) => setContactInfo({ ...contactInfo, pincode: v })}
                          placeholder="400001"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Field
                        label={`Store / Dispatch Address Override (${langLabel})`}
                        value={contactInfo[cKey('physicalAddress')] || ''}
                        onChange={(v) => setContactInfo({ ...contactInfo, [cKey('physicalAddress')]: v })}
                        placeholder="Complete postal address for footer and support desk..."
                        help="Optional override: When filled, storefront uses this exact string directly for this language."
                      />
                    </div>
                  </div>
                );
              })()}

              <SaveButton onClick={saveContactInfo} label="Save Contact Details" />
            </div>
          ) : activeTab === 'footer' ? (
            /* TAB 9: FOOTER LINKS & PAYMENT STRIP */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Footer Links & Payment Badges</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Configure footer navigation columns, social URLs, and checkout trust payment badges.
                </p>
              </div>

              {/* Payment Strip Badges */}
              <div className="neu-flat rounded-xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">Payment Strip Badges</h3>
                    <p className="text-xs text-[var(--text-muted)]">Toggle payment brand logos and customize localized badge labels.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <LocaleSelector current={paymentLocale} onChange={setPaymentLocale} />
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(payments.enabled !== false)}
                        onChange={(e) => setPayments({ ...payments, enabled: e.target.checked })}
                        className="accent-[#0082CA] rounded cursor-pointer"
                      />
                      Display Strip
                    </label>
                  </div>
                </div>

                {(() => {
                  const labelKey = paymentLocale === 'hi' ? 'label_hi' : paymentLocale === 'mr' ? 'label_mr' : 'label';
                  const langLabel = paymentLocale === 'hi' ? 'Hindi (हिंदी)' : paymentLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {(payments.badges || []).map((badge) => (
                        <div
                          key={badge.id}
                          className={`p-3 neu-flat rounded-xl border flex flex-col gap-2 transition-all ${
                            badge.enabled
                              ? 'border-[#0082CA]/50 bg-[#0082CA]/5'
                              : 'border-[var(--border)] opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--text-main)]">
                              <input
                                type="checkbox"
                                checked={Boolean(badge.enabled)}
                                onChange={() => togglePaymentBadge(badge.id)}
                                className="accent-[#0082CA] rounded cursor-pointer"
                              />
                              <span className="uppercase">{badge.id}</span>
                            </label>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">{badge.enabled ? 'Active' : 'Disabled'}</span>
                          </div>
                          <input
                            type="text"
                            value={badge[labelKey] || ''}
                            onChange={(e) => {
                              const nextBadges = (payments.badges || []).map((b) =>
                                b.id === badge.id ? { ...b, [labelKey]: e.target.value } : b
                              );
                              setPayments({ ...payments, badges: nextBadges });
                            }}
                            placeholder={`Label (${langLabel})`}
                            className="w-full px-2.5 py-1.5 neu-flat rounded-lg text-xs bg-[var(--bg-card)] text-[var(--text-main)] outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Footer Links & Social */}
              <div className="neu-flat rounded-xl p-6 space-y-4">
                <TextAreaField
                  label="Brand Tagline"
                  value={footer.tagline}
                  onChange={(v) => setFooterField('tagline', v)}
                  placeholder="Leave empty to use default description..."
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Support Phone Override"
                    value={footer.supportPhone}
                    onChange={(v) => setFooterField('supportPhone', v)}
                    placeholder="+91 7700054984"
                  />
                  <Field
                    label="Support Email Override"
                    value={footer.supportEmail}
                    onChange={(v) => setFooterField('supportEmail', v)}
                    placeholder="imagemazaprintwala@gmail.com"
                  />
                </div>

                <div className="pt-2 border-t border-[var(--border)]">
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-3">Social Links</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Facebook" value={footer.social?.facebook} onChange={(v) => setSocial('facebook', v)} placeholder="https://facebook.com/..." />
                    <Field label="Instagram" value={footer.social?.instagram} onChange={(v) => setSocial('instagram', v)} placeholder="https://instagram.com/..." />
                    <Field label="Twitter / X" value={footer.social?.twitter} onChange={(v) => setSocial('twitter', v)} placeholder="https://x.com/..." />
                    <Field label="LinkedIn" value={footer.social?.linkedin} onChange={(v) => setSocial('linkedin', v)} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Custom Link Columns</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Adding any column replaces the built-in Resources / Support links.
                  </p>
                </div>
                <button
                  onClick={addColumn}
                  className="px-3 py-1.5 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Column
                </button>
              </div>

              {footer.columns.map((col, ci) => (
                <div key={ci} className="neu-flat rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-xs">
                      <Field label={`Column ${ci + 1} Title`} value={col.title} onChange={(v) => updateColumn(ci, 'title', v)} placeholder="e.g. Corporate Services" />
                    </div>
                    <button onClick={() => removeColumn(ci)} className="text-[var(--text-faint)] hover:text-rose-600 p-2 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {col.links.map((link, li) => (
                      <div key={li} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={link.label || ''}
                          onChange={(e) => updateLink(ci, li, 'label', e.target.value)}
                          placeholder="Link Label"
                          className="flex-1 px-3 py-1.5 neu-flat rounded-lg text-xs outline-none bg-[var(--bg-card)] text-[var(--text-main)]"
                        />
                        <input
                          type="text"
                          value={link.href || ''}
                          onChange={(e) => updateLink(ci, li, 'href', e.target.value)}
                          placeholder="/path or https://..."
                          className="flex-1 px-3 py-1.5 neu-flat rounded-lg text-xs outline-none bg-[var(--bg-card)] text-[var(--text-main)]"
                        />
                        <button onClick={() => removeLink(ci, li)} className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLink(ci)}
                      className="text-xs text-[#0082CA] font-bold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Link Row
                    </button>
                  </div>
                </div>
              ))}

              <SaveButton onClick={saveFooter} label="Save Footer & Payment Badges" />
            </div>
          ) : activeTab === 'policies' ? (
            /* TAB 10: POLICIES & LEGAL */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Legal & Store Policies</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Update customer policy text without writing HTML or requiring a code deploy.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border)]">
                  {[
                    { code: 'en', label: 'EN' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setPolicyLocale(l.code)}
                      className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                        policyLocale === l.code
                          ? 'bg-[#0082CA] text-white shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtabs for the 4 policies */}
              <div className="flex gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
                {[
                  { id: 'privacy', label: 'Privacy Policy' },
                  { id: 'terms', label: 'Terms of Service' },
                  { id: 'shipping', label: 'Shipping Policy' },
                  { id: 'returns', label: 'Refund & Returns' },
                ].map((pol) => (
                  <button
                    key={pol.id}
                    onClick={() => setActivePolicyKey(pol.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activePolicyKey === pol.id
                        ? 'bg-[#0082CA] text-white shadow-xs'
                        : 'neu-flat text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {pol.label}
                  </button>
                ))}
              </div>

              {(() => {
                const titleKey = policyLocale === 'hi' ? 'title_hi' : policyLocale === 'mr' ? 'title_mr' : 'title';
                const bodyKey = policyLocale === 'hi' ? 'body_hi' : policyLocale === 'mr' ? 'body_mr' : 'body';
                const langLabel = policyLocale === 'hi' ? 'Hindi (हिंदी)' : policyLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                return (
                  <div className="neu-flat rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-xs font-bold text-[var(--text-muted)]">
                        Editing Language: <span className="text-[#0082CA] font-extrabold">{langLabel}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={`Page / Policy Title (${langLabel})`}
                        value={policies[activePolicyKey]?.[titleKey] || ''}
                        onChange={(v) =>
                          setPolicies({
                            ...policies,
                            [activePolicyKey]: { ...policies[activePolicyKey], [titleKey]: v },
                          })
                        }
                      />
                      <Field
                        label="Last Updated Notice"
                        value={policies[activePolicyKey]?.lastUpdated}
                        onChange={(v) =>
                          setPolicies({
                            ...policies,
                            [activePolicyKey]: { ...policies[activePolicyKey], lastUpdated: v },
                          })
                        }
                        placeholder="e.g. November 2026"
                      />
                    </div>

                    <TextAreaField
                      label={`Policy Document Body (${langLabel})`}
                      value={policies[activePolicyKey]?.[bodyKey] || ''}
                      onChange={(v) =>
                        setPolicies({
                          ...policies,
                          [activePolicyKey]: { ...policies[activePolicyKey], [bodyKey]: v },
                        })
                      }
                      rows={10}
                      help={`Storefront displays this text when user selects ${langLabel}. If left blank, falls back to English.`}
                    />
                  </div>
                );
              })()}

              <SaveButton
                onClick={() => savePolicy(activePolicyKey)}
                label={`Save ${policies[activePolicyKey]?.title || 'Policy'}`}
              />
            </div>
          ) : activeTab === 'about' ? (
            /* TAB 11: ABOUT US PAGE */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">About Us Page Content</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Manage the public /about page story, machinery credentials, statistics, and brand values.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border)]">
                  {[
                    { code: 'en', label: 'EN' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setAboutLocale(l.code)}
                      className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                        aboutLocale === l.code
                          ? 'bg-[#0082CA] text-white shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const badgeKey = aboutLocale === 'hi' ? 'badge_hi' : aboutLocale === 'mr' ? 'badge_mr' : 'badge';
                const titleKey = aboutLocale === 'hi' ? 'title_hi' : aboutLocale === 'mr' ? 'title_mr' : 'title';
                const subtitleKey = aboutLocale === 'hi' ? 'subtitle_hi' : aboutLocale === 'mr' ? 'subtitle_mr' : 'subtitle';
                const storyKey = aboutLocale === 'hi' ? 'story_hi' : aboutLocale === 'mr' ? 'story_mr' : 'story';
                const langLabel = aboutLocale === 'hi' ? 'Hindi (हिंदी)' : aboutLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                return (
                  <div className="space-y-6">
                    <div className="neu-flat rounded-xl p-6 space-y-4">
                      <span className="text-xs font-bold text-[var(--text-muted)] block pb-2 border-b border-[var(--border)]">
                        Header & Story Copy ({langLabel})
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          label={`Badge Text (${langLabel})`}
                          value={aboutPage[badgeKey] || ''}
                          onChange={(v) => setAboutPage({ ...aboutPage, [badgeKey]: v })}
                          placeholder="e.g. About Maza Printwala"
                        />
                        <Field
                          label={`Main Headline (${langLabel})`}
                          value={aboutPage[titleKey] || ''}
                          onChange={(v) => setAboutPage({ ...aboutPage, [titleKey]: v })}
                          placeholder="e.g. Precision Industrial Printing"
                        />
                      </div>
                      <Field
                        label={`Subtitle / Intro (${langLabel})`}
                        value={aboutPage[subtitleKey] || ''}
                        onChange={(v) => setAboutPage({ ...aboutPage, [subtitleKey]: v })}
                        placeholder="Brief overview summary..."
                      />
                      <TextAreaField
                        label={`Company Story Narrative (${langLabel})`}
                        value={aboutPage[storyKey] || ''}
                        onChange={(v) => setAboutPage({ ...aboutPage, [storyKey]: v })}
                        rows={6}
                        placeholder="Detailed story paragraphs..."
                        help="Double line breaks create separate paragraphs on the storefront."
                      />
                    </div>

                    <div className="neu-flat rounded-xl p-6 space-y-4">
                      <span className="text-xs font-bold text-[var(--text-muted)] block pb-2 border-b border-[var(--border)]">
                        Story Visual Media & Stats
                      </span>
                      <ImageField
                        label="About Story Image (Upload to Cloudinary)"
                        value={aboutPage.storyImage}
                        onChange={(url) => setAboutPage({ ...aboutPage, storyImage: url })}
                        placeholder="https://res.cloudinary.com/... or click Upload"
                        help="Recommended dimensions: 900x700px JPEG/WebP."
                      />

                      <div className="pt-2">
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2">4 Key Performance Counters</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {(aboutPage.stats || []).map((st, sIdx) => (
                            <div key={sIdx} className="p-3 neu-flat rounded-lg space-y-2">
                              <input
                                type="text"
                                value={st.value}
                                onChange={(e) => {
                                  const nextStats = [...aboutPage.stats];
                                  nextStats[sIdx] = { ...nextStats[sIdx], value: e.target.value };
                                  setAboutPage({ ...aboutPage, stats: nextStats });
                                }}
                                placeholder="50,000+"
                                className="w-full text-xs font-black text-[#0082CA] bg-transparent outline-none"
                              />
                              <input
                                type="text"
                                value={st.label}
                                onChange={(e) => {
                                  const nextStats = [...aboutPage.stats];
                                  nextStats[sIdx] = { ...nextStats[sIdx], label: e.target.value };
                                  setAboutPage({ ...aboutPage, stats: nextStats });
                                }}
                                placeholder="Happy Clients"
                                className="w-full text-[11px] font-bold text-[var(--text-muted)] bg-transparent outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="neu-flat rounded-xl p-6 space-y-4">
                      <span className="text-xs font-bold text-[var(--text-muted)] block pb-2 border-b border-[var(--border)]">
                        3 Core Pillars / Values
                      </span>
                      <div className="space-y-3">
                        {(aboutPage.values || []).map((val, vIdx) => (
                          <div key={vIdx} className="p-3 neu-flat rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={val.title}
                              onChange={(e) => {
                                const nextVals = [...aboutPage.values];
                                nextVals[vIdx] = { ...nextVals[vIdx], title: e.target.value };
                                setAboutPage({ ...aboutPage, values: nextVals });
                              }}
                              placeholder="Pillar Title"
                              className="text-xs font-bold text-[var(--text-main)] bg-transparent outline-none"
                            />
                            <input
                              type="text"
                              value={val.desc}
                              onChange={(e) => {
                                const nextVals = [...aboutPage.values];
                                nextVals[vIdx] = { ...nextVals[vIdx], desc: e.target.value };
                                setAboutPage({ ...aboutPage, values: nextVals });
                              }}
                              placeholder="Short description..."
                              className="md:col-span-2 text-xs text-[var(--text-muted)] bg-transparent outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <SaveButton onClick={saveAboutPage} label="Save About Page" />
            </div>
          ) : activeTab === 'bulk_enquiry' ? (
            /* TAB 12: BULK ENQUIRY PAGE */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Bulk & B2B Enquiry Copy</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Customize commercial wholesale quotes headline, tier discount claims, and guarantee notices.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border)]">
                  {[
                    { code: 'en', label: 'EN' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setBulkLocale(l.code)}
                      className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                        bulkLocale === l.code
                          ? 'bg-[#0082CA] text-white shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const badgeKey = bulkLocale === 'hi' ? 'badge_hi' : bulkLocale === 'mr' ? 'badge_mr' : 'badge';
                const titleKey = bulkLocale === 'hi' ? 'title_hi' : bulkLocale === 'mr' ? 'title_mr' : 'title';
                const subtitleKey = bulkLocale === 'hi' ? 'subtitle_hi' : bulkLocale === 'mr' ? 'subtitle_mr' : 'subtitle';
                const guaranteeKey = bulkLocale === 'hi' ? 'guarantee_hi' : bulkLocale === 'mr' ? 'guarantee_mr' : 'guarantee';
                const btnKey = bulkLocale === 'hi' ? 'buttonText_hi' : bulkLocale === 'mr' ? 'buttonText_mr' : 'buttonText';
                const langLabel = bulkLocale === 'hi' ? 'Hindi (हिंदी)' : bulkLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                return (
                  <div className="neu-flat rounded-xl p-6 space-y-4">
                    <span className="text-xs font-bold text-[var(--text-muted)] block pb-2 border-b border-[var(--border)]">
                      Commercial Copy ({langLabel})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={`Header Badge (${langLabel})`}
                        value={bulkEnquiry[badgeKey] || ''}
                        onChange={(v) => setBulkEnquiry({ ...bulkEnquiry, [badgeKey]: v })}
                        placeholder="e.g. B2B & Corporate Printing"
                      />
                      <Field
                        label={`Page Headline (${langLabel})`}
                        value={bulkEnquiry[titleKey] || ''}
                        onChange={(v) => setBulkEnquiry({ ...bulkEnquiry, [titleKey]: v })}
                        placeholder="e.g. Volume Printing & Custom Bulk Quotes"
                      />
                    </div>
                    <Field
                      label={`Intro Subtitle (${langLabel})`}
                      value={bulkEnquiry[subtitleKey] || ''}
                      onChange={(v) => setBulkEnquiry({ ...bulkEnquiry, [subtitleKey]: v })}
                      placeholder="Explain volume criteria and pricing incentives..."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label={`Guarantee Note (${langLabel})`}
                        value={bulkEnquiry[guaranteeKey] || ''}
                        onChange={(v) => setBulkEnquiry({ ...bulkEnquiry, [guaranteeKey]: v })}
                        placeholder="🔒 Strictly confidential. We never share enterprise artwork..."
                      />
                      <Field
                        label={`Submit CTA Button Label (${langLabel})`}
                        value={bulkEnquiry[btnKey] || ''}
                        onChange={(v) => setBulkEnquiry({ ...bulkEnquiry, [btnKey]: v })}
                        placeholder="e.g. Submit Commercial Quote"
                      />
                    </div>

                    <div className="pt-3">
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-2">3 Advantage Badges</label>
                      <div className="space-y-3">
                        {(bulkEnquiry.benefits || []).map((b, bIdx) => (
                          <div key={bIdx} className="p-3 neu-flat rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={b.title}
                              onChange={(e) => {
                                const nextB = [...bulkEnquiry.benefits];
                                nextB[bIdx] = { ...nextB[bIdx], title: e.target.value };
                                setBulkEnquiry({ ...bulkEnquiry, benefits: nextB });
                              }}
                              placeholder="Title"
                              className="text-xs font-bold text-[var(--text-main)] bg-transparent outline-none"
                            />
                            <input
                              type="text"
                              value={b.desc}
                              onChange={(e) => {
                                const nextB = [...bulkEnquiry.benefits];
                                nextB[bIdx] = { ...nextB[bIdx], desc: e.target.value };
                                setBulkEnquiry({ ...bulkEnquiry, benefits: nextB });
                              }}
                              placeholder="Description..."
                              className="md:col-span-2 text-xs text-[var(--text-muted)] bg-transparent outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <SaveButton onClick={saveBulkEnquiry} label="Save Bulk Enquiry Copy" />
            </div>
          ) : activeTab === 'seo' ? (
            /* TAB 13: PAGE SEO & META */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Page SEO Metadata & OpenGraph</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Configure search engine titles, meta descriptions, and social share image cards for major storefront routes.
                  </p>
                </div>
                <LocaleSelector current={seoLocale} onChange={setSeoLocale} />
              </div>

              {/* Subtabs for routes */}
              <div className="flex gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
                {[
                  { id: 'home', label: 'Homepage' },
                  { id: 'about', label: 'About Us' },
                  { id: 'bulk', label: 'Bulk Enquiry' },
                  { id: 'policies', label: 'Policies' },
                ].map((pg) => (
                  <button
                    key={pg.id}
                    onClick={() => setActiveMetaPage(pg.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeMetaPage === pg.id
                        ? 'bg-[#0082CA] text-white shadow-xs'
                        : 'neu-flat text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {pg.label}
                  </button>
                ))}
              </div>

              {(() => {
                const titleKey = seoLocale === 'hi' ? 'title_hi' : seoLocale === 'mr' ? 'title_mr' : 'title';
                const descKey = seoLocale === 'hi' ? 'description_hi' : seoLocale === 'mr' ? 'description_mr' : 'description';
                const kwKey = seoLocale === 'hi' ? 'keywords_hi' : seoLocale === 'mr' ? 'keywords_mr' : 'keywords';
                const langLabel = seoLocale === 'hi' ? 'Hindi (हिंदी)' : seoLocale === 'mr' ? 'Marathi (मराठी)' : 'English';

                return (
                  <div className="neu-flat rounded-xl p-6 space-y-4">
                    <Field
                      label={`Browser & Search Title (${langLabel})`}
                      value={pageMeta[activeMetaPage]?.[titleKey] || ''}
                      onChange={(v) =>
                        setPageMeta({
                          ...pageMeta,
                          [activeMetaPage]: { ...pageMeta[activeMetaPage], [titleKey]: v },
                        })
                      }
                      placeholder="e.g. Maza Printwala | Online Printing Services"
                      help="Optimal length: 50-60 characters."
                    />

                    <TextAreaField
                      label={`Search Meta Description (${langLabel})`}
                      value={pageMeta[activeMetaPage]?.[descKey] || ''}
                      onChange={(v) =>
                        setPageMeta({
                          ...pageMeta,
                          [activeMetaPage]: { ...pageMeta[activeMetaPage], [descKey]: v },
                        })
                      }
                      rows={3}
                      placeholder="Search snippet summary..."
                      help="Optimal length: 140-160 characters."
                    />

                    <Field
                      label={`Keywords (${langLabel}, comma separated)`}
                      value={pageMeta[activeMetaPage]?.[kwKey] || ''}
                      onChange={(v) =>
                        setPageMeta({
                          ...pageMeta,
                          [activeMetaPage]: { ...pageMeta[activeMetaPage], [kwKey]: v },
                        })
                      }
                      placeholder="printing, visiting cards, bulk print, corporate gifting"
                    />

                    <ImageField
                      label="Social Share / OG Image (Upload to Cloudinary)"
                      value={pageMeta[activeMetaPage]?.ogImage}
                      onChange={(url) =>
                        setPageMeta({
                          ...pageMeta,
                          [activeMetaPage]: { ...pageMeta[activeMetaPage], ogImage: url },
                        })
                      }
                      placeholder="https://res.cloudinary.com/... or click Upload"
                      help="Recommended size: 1200x630px. Used by WhatsApp, Facebook, LinkedIn, Twitter preview cards."
                    />
                  </div>
                );
              })()}

              <SaveButton onClick={savePageMeta} label={`Save ${activeMetaPage.toUpperCase()} Metadata`} />
            </div>
          ) : activeTab === 'menu' ? (
            /* TAB 14: NAVIGATION MENU */
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Navigation & Mega Menu Sequence</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Control which categories appear first in the horizontal header strip and mega menu dropdown.
                  </p>
                </div>
                <LocaleSelector current={menuLocale} onChange={setMenuLocale} />
              </div>

              {(() => {
                const langLabel = menuLocale === 'hi' ? 'Hindi (हिंदी)' : menuLocale === 'mr' ? 'Marathi (मराठी)' : 'English';
                const linkLabelKey = menuLocale === 'hi' ? 'label_hi' : menuLocale === 'mr' ? 'label_mr' : 'label';
                const linkBadgeKey = menuLocale === 'hi' ? 'badge_hi' : menuLocale === 'mr' ? 'badge_mr' : 'badge';

                return (
                  <div className="neu-flat rounded-xl p-6 space-y-6">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-3">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          Category Sequence & Visibility
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Editing labels in: <strong className="text-[#0082CA]">{langLabel}</strong>
                        </span>
                      </div>
                      <div className="space-y-2">
                        {(navMenu.orderedSlugs || []).map((slug, idx) => {
                          const catObj = allCategories.find((c) => c.slug === slug);
                          const defaultName = catObj?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                          const isHidden = (navMenu.hiddenSlugs || []).includes(slug);
                          const overrideKey = menuLocale === 'hi' ? `${slug}_hi` : menuLocale === 'mr' ? `${slug}_mr` : slug;

                          return (
                            <div
                              key={slug}
                              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                                isHidden
                                  ? 'neu-flat/40 border-dashed border-[var(--border)] opacity-60'
                                  : 'neu-flat border-[var(--border)]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-[#0082CA] w-6">{idx + 1}.</span>
                                <div>
                                  <span className="text-xs font-bold text-[var(--text-main)]">{defaultName}</span>
                                  <span className="text-[10px] text-[var(--text-muted)] ml-2">({slug})</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                <input
                                  type="text"
                                  value={navMenu.labels?.[overrideKey] || ''}
                                  onChange={(e) => {
                                    const nextLabels = { ...(navMenu.labels || {}), [overrideKey]: e.target.value };
                                    setNavMenu({ ...navMenu, labels: nextLabels });
                                  }}
                                  placeholder={`Label (${langLabel})`}
                                  className="px-2.5 py-1 text-xs neu-flat rounded-md bg-[var(--bg-card)] text-[var(--text-main)] outline-none w-32 sm:w-36"
                                />
                                <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!isHidden}
                                    onChange={(e) => {
                                      const currentHidden = navMenu.hiddenSlugs || [];
                                      const nextHidden = e.target.checked
                                        ? currentHidden.filter((s) => s !== slug)
                                        : [...currentHidden, slug];
                                      setNavMenu({ ...navMenu, hiddenSlugs: nextHidden });
                                    }}
                                    className="accent-[#0082CA] rounded cursor-pointer"
                                  />
                                  Visible
                                </label>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const nextOrder = [...navMenu.orderedSlugs];
                                    const temp = nextOrder[idx - 1];
                                    nextOrder[idx - 1] = nextOrder[idx];
                                    nextOrder[idx] = temp;
                                    setNavMenu({ ...navMenu, orderedSlugs: nextOrder });
                                  }}
                                  className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-20 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === navMenu.orderedSlugs.length - 1}
                                  onClick={() => {
                                    const nextOrder = [...navMenu.orderedSlugs];
                                    const temp = nextOrder[idx + 1];
                                    nextOrder[idx + 1] = nextOrder[idx];
                                    nextOrder[idx] = temp;
                                    setNavMenu({ ...navMenu, orderedSlugs: nextOrder });
                                  }}
                                  className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-20 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                            Custom Header Navigation Links
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            Direct shortcuts shown in header alongside categories (e.g. Bulk Enquiry, About Us).
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nextLinks = [
                              ...(navMenu.customLinks || []),
                              { label: 'New Link', href: '/', badge: '', enabled: true },
                            ];
                            setNavMenu({ ...navMenu, customLinks: nextLinks });
                          }}
                          className="px-3 py-1.5 neu-flat text-xs font-bold text-[#0082CA] rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Link
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(navMenu.customLinks || []).map((link, lIdx) => (
                          <div key={lIdx} className="p-3 neu-flat rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--text-muted)]">Link #{lIdx + 1}</span>
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={link.enabled !== false}
                                    onChange={(e) => {
                                      const nextLinks = [...(navMenu.customLinks || [])];
                                      nextLinks[lIdx] = { ...nextLinks[lIdx], enabled: e.target.checked };
                                      setNavMenu({ ...navMenu, customLinks: nextLinks });
                                    }}
                                    className="accent-[#0082CA] rounded cursor-pointer"
                                  />
                                  Active
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextLinks = (navMenu.customLinks || []).filter((_, i) => i !== lIdx);
                                    setNavMenu({ ...navMenu, customLinks: nextLinks });
                                  }}
                                  className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={link[linkLabelKey] || ''}
                                onChange={(e) => {
                                  const nextLinks = [...(navMenu.customLinks || [])];
                                  nextLinks[lIdx] = { ...nextLinks[lIdx], [linkLabelKey]: e.target.value };
                                  setNavMenu({ ...navMenu, customLinks: nextLinks });
                                }}
                                placeholder={`Label (${langLabel})`}
                                className="px-3 py-1.5 neu-flat rounded-lg text-xs bg-[var(--bg-card)] text-[var(--text-main)] outline-none"
                              />
                              <input
                                type="text"
                                value={link.href || ''}
                                onChange={(e) => {
                                  const nextLinks = [...(navMenu.customLinks || [])];
                                  nextLinks[lIdx] = { ...nextLinks[lIdx], href: e.target.value };
                                  setNavMenu({ ...navMenu, customLinks: nextLinks });
                                }}
                                placeholder="/path (e.g. /bulk-enquiry)"
                                className="px-3 py-1.5 neu-flat rounded-lg text-xs bg-[var(--bg-card)] text-[var(--text-main)] outline-none"
                              />
                              <input
                                type="text"
                                value={link[linkBadgeKey] || ''}
                                onChange={(e) => {
                                  const nextLinks = [...(navMenu.customLinks || [])];
                                  nextLinks[lIdx] = { ...nextLinks[lIdx], [linkBadgeKey]: e.target.value };
                                  setNavMenu({ ...navMenu, customLinks: nextLinks });
                                }}
                                placeholder={`Badge (${langLabel}) (e.g. Hot)`}
                                className="px-3 py-1.5 neu-flat rounded-lg text-xs bg-[var(--bg-card)] text-[var(--text-main)] outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <SaveButton onClick={saveNavMenu} label="Save Menu Sequence" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
