require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Enquiry = require('../models/Enquiry');
const Banner = require('../models/Banner');
const Testimonial = require('../models/Testimonial');
const CMSPage = require('../models/CMSPage');
const HomepageContent = require('../models/HomepageContent');
const SiteSettings = require('../models/SiteSettings');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agricommerce';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400';

// ─── CMS Page bodies ──────────────────────────────────────────────────────────

const cmsPages = [
  {
    slug: 'about',
    title: 'About AgriCommerce',
    metaTitle: 'About Us - AgriCommerce',
    metaDescription: 'Learn about AgriCommerce — India\'s trusted agricultural marketplace connecting farmers to buyers.',
    body: `
      <h1>About AgriCommerce</h1>
      <p>AgriCommerce was founded in 2018 with a simple but powerful mission: to bridge the gap between farmers and buyers across India. We believe that every farmer deserves fair prices for their produce and every buyer deserves the freshest, highest-quality agricultural products available.</p>
      <p>Our platform connects thousands of farmers from Punjab, Haryana, Uttar Pradesh, Maharashtra, and other agricultural heartlands of India directly with retailers, restaurants, exporters, and individual consumers. By eliminating unnecessary middlemen, we ensure that both farmers and buyers benefit from fair, transparent pricing.</p>
      <p>We offer a wide range of products including seeds, grains, spices, herbs, organic fertilizers, and modern farming tools. Our quality assurance team verifies every product before it is listed on our platform, ensuring that you receive only the best.</p>
      <p>With over 50,000 registered users, 5,000 verified farmers, and 100,000+ successful transactions, AgriCommerce has become one of India's most trusted agricultural e-commerce platforms. We are committed to supporting sustainable farming practices and empowering rural communities through technology.</p>
      <p>Our team of agricultural experts, technology professionals, and logistics specialists works tirelessly to provide you with a seamless experience — from browsing products to doorstep delivery. We are proud to support India's farming community and look forward to growing together.</p>
    `,
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    metaTitle: 'Contact AgriCommerce - Get in Touch',
    metaDescription: 'Contact the AgriCommerce team for support, business enquiries, or feedback.',
    body: `
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Whether you have a question about our products, need help with an order, or want to explore bulk purchasing opportunities, our team is here to help.</p>
      <h2>Get in Touch</h2>
      <ul>
        <li><strong>Email:</strong> info@agricommerce.com</li>
        <li><strong>Phone:</strong> +91 98765 43210</li>
        <li><strong>WhatsApp:</strong> +91 98765 43210</li>
        <li><strong>Address:</strong> 123 Farmers Market, Connaught Place, New Delhi — 110001</li>
      </ul>
      <h2>Business Hours</h2>
      <p>Monday to Saturday: 9:00 AM – 6:00 PM IST<br/>Sunday: 10:00 AM – 2:00 PM IST</p>
      <h2>For Bulk Orders & B2B Enquiries</h2>
      <p>If you are a retailer, restaurant, exporter, or institutional buyer looking for bulk quantities, please fill out our <a href="/enquiry">B2B Enquiry Form</a> and our sales team will contact you within 24 hours with a customized quote.</p>
      <p>We also welcome farmer registrations. If you are a farmer looking to sell your produce on our platform, please email us at farmers@agricommerce.com with details about your farm and produce.</p>
    `,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy - AgriCommerce',
    metaDescription: 'Read the AgriCommerce privacy policy to understand how we collect, use, and protect your personal information.',
    body: `
      <h1>Privacy Policy</h1>
      <p><em>Last updated: January 1, 2024</em></p>
      <p>AgriCommerce ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully.</p>
      <h2>1. Information We Collect</h2>
      <p>We may collect personal information that you voluntarily provide when you register for an account, place an order, or contact us. This includes your name, email address, phone number, shipping address, and payment information. We also automatically collect certain information about your device and how you interact with our website, including IP addresses, browser type, pages visited, and time spent on pages.</p>
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to process your orders, send you transactional emails, respond to your enquiries, improve our website and services, send you marketing communications (with your consent), and comply with legal obligations. We do not sell your personal information to third parties under any circumstances.</p>
      <h2>3. Cookies and Tracking Technologies</h2>
      <p>We use cookies and similar tracking technologies to enhance your experience on our website. These help us remember your preferences, analyze website traffic, and provide personalized content. You can control cookie settings through your browser preferences, though disabling cookies may affect website functionality.</p>
      <h2>4. Data Security</h2>
      <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology and processed through PCI-DSS compliant payment gateways.</p>
      <h2>5. Contact for Privacy Concerns</h2>
      <p>If you have any questions about this Privacy Policy or our privacy practices, please contact our Data Protection Officer at privacy@agricommerce.com or at our registered address: 123 Farmers Market, New Delhi — 110001.</p>
    `,
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    metaTitle: 'Terms & Conditions - AgriCommerce',
    metaDescription: 'Read the terms and conditions governing your use of the AgriCommerce platform.',
    body: `
      <h1>Terms &amp; Conditions</h1>
      <p><em>Last updated: January 1, 2024</em></p>
      <p>These Terms and Conditions ("Terms") govern your use of the AgriCommerce website and services. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our services.</p>
      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years of age and legally capable of entering into a binding contract to use our platform. By using AgriCommerce, you represent and warrant that you meet these eligibility requirements.</p>
      <h2>2. Account Registration</h2>
      <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
      <h2>3. Product Listings and Pricing</h2>
      <p>All product listings on AgriCommerce are subject to availability. Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices at any time without prior notice. In the event of a pricing error, we reserve the right to cancel orders placed at incorrect prices.</p>
      <h2>4. Orders and Payment</h2>
      <p>By placing an order, you make an offer to purchase the specified products at the listed price. We reserve the right to accept or reject any order. Payment must be made in full at the time of ordering through our accepted payment methods. All transactions are secured with industry-standard encryption.</p>
      <h2>5. Limitation of Liability</h2>
      <p>AgriCommerce shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid for the specific product or service giving rise to the claim.</p>
    `,
  },
  {
    slug: 'shipping',
    title: 'Shipping Policy',
    metaTitle: 'Shipping Policy - AgriCommerce',
    metaDescription: 'Learn about AgriCommerce\'s shipping options, delivery timelines, and shipping charges.',
    body: `
      <h1>Shipping Policy</h1>
      <p>At AgriCommerce, we are committed to delivering your agricultural products safely and promptly. Please read our shipping policy carefully before placing your order.</p>
      <h2>Shipping Partners</h2>
      <p>We partner with leading logistics companies including Delhivery, Blue Dart, DTDC, and India Post to ensure reliable delivery across all 28 states and 8 union territories of India. For remote and rural areas, we work with specialized last-mile delivery partners to ensure you receive your order.</p>
      <h2>Delivery Timelines</h2>
      <ul>
        <li><strong>Metro Cities</strong> (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad): 2–4 business days</li>
        <li><strong>Tier 2 Cities:</strong> 4–6 business days</li>
        <li><strong>Tier 3 Cities and Rural Areas:</strong> 6–10 business days</li>
        <li><strong>Remote Areas:</strong> 10–14 business days</li>
      </ul>
      <h2>Shipping Charges</h2>
      <p>Shipping charges are calculated based on the weight of your order and your delivery location. Orders above ₹2,000 qualify for free shipping to most locations in India. For orders below ₹2,000, standard shipping charges of ₹60–₹120 apply depending on location and weight.</p>
      <h2>Bulk Order Shipping</h2>
      <p>For bulk orders (above 50 kg or orders valued above ₹50,000), we arrange dedicated freight transport with special handling for perishable agricultural products. Please contact our logistics team for customized shipping solutions for large orders.</p>
      <h2>Order Tracking</h2>
      <p>Once your order is dispatched, you will receive an SMS and email with your tracking number and a link to track your shipment in real-time. You can also track your order by logging into your AgriCommerce account and visiting the 'My Orders' section.</p>
    `,
  },
  {
    slug: 'refund',
    title: 'Refund & Return Policy',
    metaTitle: 'Refund & Return Policy - AgriCommerce',
    metaDescription: 'Understand AgriCommerce\'s refund and return policy for agricultural products.',
    body: `
      <h1>Refund &amp; Return Policy</h1>
      <p>We take the quality of our products seriously. If you are not completely satisfied with your purchase, we are here to help. Please read our refund and return policy carefully.</p>
      <h2>Return Eligibility</h2>
      <p>Products may be returned within 7 days of delivery under the following conditions: the product is damaged, defective, or significantly different from what was described on our website. Due to the perishable nature of agricultural products, we cannot accept returns of fresh produce, seeds, or fertilizers that have been opened or used, unless the product is found to be defective.</p>
      <h2>Non-Returnable Items</h2>
      <p>The following items cannot be returned: opened seed packets, used fertilizers or pesticides, perishable items (fresh produce, herbs), items on sale or clearance, and personalized or custom orders. Farming tools and equipment may be returned if unused and in original packaging within 7 days.</p>
      <h2>Refund Process</h2>
      <p>Once we receive and inspect your return, we will send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed within 5–7 business days. The refund will be credited to your original payment method. Shipping costs are non-refundable unless the return is due to our error.</p>
      <h2>Damaged or Defective Products</h2>
      <p>If you receive a damaged or defective product, please contact us within 48 hours of delivery with photographs of the damaged product and packaging. We will arrange a replacement or full refund at no additional cost to you. Please do not dispose of the damaged product until the case is resolved.</p>
      <h2>Contact for Returns</h2>
      <p>To initiate a return or refund, please contact our customer service team at returns@agricommerce.com or call +91 98765 43210. Our team is available Monday to Saturday from 9:00 AM to 6:00 PM IST.</p>
    `,
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    metaTitle: 'FAQ - AgriCommerce',
    metaDescription: 'Find answers to frequently asked questions about AgriCommerce products, orders, and services.',
    body: `
      <h1>Frequently Asked Questions</h1>
      <h2>General Questions</h2>
      <h3>What is AgriCommerce?</h3>
      <p>AgriCommerce is India's trusted agricultural e-commerce marketplace that connects farmers directly with buyers. We offer a wide range of agricultural products including seeds, grains, spices, organic fertilizers, and farming tools at competitive prices.</p>
      <h3>Is AgriCommerce available across all of India?</h3>
      <p>Yes, we deliver to all states and union territories across India. Delivery timelines may vary depending on your location. Please refer to our Shipping Policy for more details.</p>
      <h2>Orders & Payment</h2>
      <h3>What payment methods do you accept?</h3>
      <p>We accept all major payment methods including credit cards, debit cards, net banking, UPI (Google Pay, PhonePe, Paytm), and cash on delivery for eligible orders. For bulk B2B orders, we also accept NEFT/RTGS bank transfers.</p>
      <h3>Can I modify or cancel my order after placing it?</h3>
      <p>You can modify or cancel your order within 2 hours of placing it by contacting our customer service team. Once the order is dispatched, it cannot be cancelled but may be eligible for return as per our Refund Policy.</p>
      <h2>Products</h2>
      <h3>Are your products certified organic?</h3>
      <p>Products listed as "organic" on our platform are sourced from certified organic farms and carry appropriate NPOP or NOP certifications. You can find certification details in each product's description. We also offer non-organic agricultural products at competitive prices.</p>
      <h3>Do you offer bulk/wholesale pricing?</h3>
      <p>Yes! We offer special bulk pricing for retailers, restaurants, exporters, and institutional buyers. Please submit a B2B Enquiry through our website or contact our sales team at b2b@agricommerce.com for a customized quote based on your requirements.</p>
      <h2>Farming & Agriculture Support</h2>
      <h3>Do you provide farming advice or agricultural guidance?</h3>
      <p>Yes, our team of agricultural experts is available to provide guidance on seed selection, fertilizer usage, crop management, and best farming practices. You can reach our agri-experts via email at experts@agricommerce.com or through our customer helpline during business hours.</p>
    `,
  },
];

// ─── Main seed function ────────────────────────────────────────────────────────

const seed = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── 1. Clear all collections ────────────────────────────────────────────
    console.log('🗑️  Clearing all collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Enquiry.deleteMany({}),
      Banner.deleteMany({}),
      Testimonial.deleteMany({}),
      CMSPage.deleteMany({}),
      HomepageContent.deleteMany({}),
      SiteSettings.deleteMany({}),
    ]);
    console.log('✅ All collections cleared\n');

    // ── 2. Create admin user ────────────────────────────────────────────────
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@agri.com',
      password: 'Admin@1234',
      role: 'admin',
    });
    console.log(`✅ Admin user created: ${admin.email}\n`);

    // ── 3. Create categories ────────────────────────────────────────────────
    console.log('📂 Creating categories...');
    const categoryData = [
      {
        name: 'Seeds & Grains',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        displayOrder: 1,
      },
      {
        name: 'Spices & Herbs',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
        displayOrder: 2,
      },
      {
        name: 'Fertilizers & Soil Care',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        displayOrder: 3,
      },
      {
        name: 'Farming Tools & Equipment',
        image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop',
        displayOrder: 4,
      },
      {
        name: 'Organic & Pesticides',
        image: 'https://images.unsplash.com/photo-1578496781514-4d9b8ef0d9a9?w=400&h=300&fit=crop',
        displayOrder: 5,
      },
      {
        name: 'Vegetables Seeds',
        image: 'https://images.unsplash.com/photo-1464226184081-280282a0fc27?w=400&h=300&fit=crop',
        displayOrder: 6,
      },
    ];

    const categories = await Category.create(categoryData);
    const [catSeeds, catSpices, catFertilizers, catTools, catOrganic, catVeggies] = categories;
    console.log(`✅ ${categories.length} categories created\n`);

    // ── 4. Create products ──────────────────────────────────────────────────
    console.log('🌾 Creating products...');
    const productData = [
      // Seeds & Grains
      {
        name: 'Hybrid Wheat Seeds',
        category: catSeeds._id,
        images: ['https://images.unsplash.com/photo-1561180286-d3fee7d55364?w=500&h=500&fit=crop'],
        price: 450,
        shortDescription: 'High-yield hybrid wheat seeds suitable for Rabi season cultivation across North India.',
        description: `<p>Our Hybrid Wheat Seeds are specially developed for high-yield performance in varied soil conditions across India. Premium quality seeds treated with fungicide.</p>`,
        specs: [
          { key: 'Variety', value: 'HD-3086' },
          { key: 'Season', value: 'Rabi' },
          { key: 'Maturity', value: '120–130 days' },
          { key: 'Yield', value: '55–65 q/ha' },
          { key: 'Pack Size', value: '10 kg' },
        ],
        stock: 500,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Premium Basmati Rice',
        category: catSeeds._id,
        images: ['https://images.unsplash.com/photo-1455619452474-d2be8b1e4e31?w=500&h=500&fit=crop'],
        price: 780,
        shortDescription: 'Aromatic long-grain Basmati rice seeds for Kharif season — trusted by farmers across India.',
        description: `<p>Premium Basmati Rice Seeds from certified seed producers. GI-tagged variety with excellent export quality.</p>`,
        specs: [
          { key: 'Variety', value: 'Pusa Basmati 1121' },
          { key: 'Season', value: 'Kharif' },
          { key: 'Maturity', value: '140–145 days' },
          { key: 'Yield', value: '35–45 q/ha' },
          { key: 'Pack Size', value: '10 kg' },
        ],
        stock: 350,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Organic Corn Seeds',
        category: catSeeds._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 320,
        shortDescription: 'Certified organic open-pollinated corn seeds for chemical-free farming.',
        description: `<p>Our Organic Corn Seeds are NPOP certified organic and completely free from synthetic chemicals and GMOs.</p>`,
        specs: [
          { key: 'Type', value: 'Open Pollinated (OP)' },
          { key: 'Certification', value: 'NPOP Organic' },
          { key: 'Season', value: 'Kharif & Rabi' },
          { key: 'Maturity', value: '90–100 days' },
          { key: 'Pack Size', value: '5 kg' },
        ],
        stock: 280,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Millet Seeds (Bajra)',
        category: catSeeds._id,
        images: ['https://images.unsplash.com/photo-1512621539084-d4f2a9e1ae76?w=500&h=500&fit=crop'],
        price: 220,
        shortDescription: 'High-nutrition millet seeds resistant to drought and pests.',
        description: `<p>Premium Bajra seeds suitable for arid and semi-arid regions. High nutritional value and drought-resistant variety.</p>`,
        specs: [
          { key: 'Variety', value: 'ICMB-155' },
          { key: 'Season', value: 'Kharif' },
          { key: 'Maturity', value: '65–75 days' },
          { key: 'Yield', value: '20–25 q/ha' },
          { key: 'Pack Size', value: '10 kg' },
        ],
        stock: 400,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },

      // Spices & Herbs
      {
        name: 'Premium Turmeric Powder',
        category: catSpices._id,
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop'],
        price: 280,
        shortDescription: 'Pure, high-curcumin Lakadong turmeric powder from Meghalaya — no adulterants.',
        description: `<p>Our Premium Turmeric Powder is made from Lakadong turmeric with exceptional curcumin content of 6–7%.</p>`,
        specs: [
          { key: 'Variety', value: 'Lakadong' },
          { key: 'Origin', value: 'Meghalaya, India' },
          { key: 'Curcumin Content', value: '6–7%' },
          { key: 'Moisture', value: '<10%' },
          { key: 'Pack Size', value: '500g' },
        ],
        stock: 480,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Organic Cumin Seeds',
        category: catSpices._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 195,
        shortDescription: 'Aromatic organic cumin seeds (jeera) from Rajasthan — bold flavor, machine-cleaned.',
        description: `<p>AgriCommerce Organic Cumin Seeds from certified organic farms in Rajasthan. Bold, earthy aroma.</p>`,
        specs: [
          { key: 'Variety', value: 'RZ-19 (Rajasthan)' },
          { key: 'Certification', value: 'NPOP Organic' },
          { key: 'Purity', value: '99.5%' },
          { key: 'Moisture', value: '<8%' },
          { key: 'Pack Size', value: '500g' },
        ],
        stock: 350,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Kashmiri Red Chilli',
        category: catSpices._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 360,
        shortDescription: 'Authentic Kashmiri Lacha chilli — vibrant red color, mild heat, rich aroma.',
        description: `<p>Kashmiri Red Chilli (Lacha variety) with brilliant deep-red color and mild, fruity heat.</p>`,
        specs: [
          { key: 'Variety', value: 'Lacha (Kashmir)' },
          { key: 'Heat Level', value: 'Mild (1,000–2,000 SHU)' },
          { key: 'Color Value', value: '>120 ASTA units' },
          { key: 'Moisture', value: '<10%' },
          { key: 'Pack Size', value: '500g' },
        ],
        stock: 290,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Coriander Seeds',
        category: catSpices._id,
        images: ['https://images.unsplash.com/photo-1563011352-c9d28c21b6f1?w=500&h=500&fit=crop'],
        price: 240,
        shortDescription: 'Pure coriander seeds (dhania) with aromatic, citrus notes.',
        description: `<p>Pure coriander seeds with authentic aroma and flavor. Machine-cleaned and quality tested.</p>`,
        specs: [
          { key: 'Origin', value: 'Rajasthan' },
          { key: 'Purity', value: '99%' },
          { key: 'Moisture', value: '<9%' },
          { key: 'Color', value: 'Light brown' },
          { key: 'Pack Size', value: '500g' },
        ],
        stock: 320,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },

      // Fertilizers & Soil Care
      {
        name: 'Vermicompost Organic Fertilizer',
        category: catFertilizers._id,
        images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop'],
        price: 180,
        shortDescription: 'Premium vermicompost made from earthworm castings — nature\'s perfect soil conditioner.',
        description: `<p>Rich, nutrient-dense vermicompost that improves soil structure and water retention.</p>`,
        specs: [
          { key: 'NPK Content', value: '1.5-0.8-0.6' },
          { key: 'Organic Carbon', value: '>20%' },
          { key: 'pH', value: '6.5–7.5' },
          { key: 'Moisture', value: '30–40%' },
          { key: 'Pack Size', value: '50 kg bag' },
        ],
        stock: 550,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'NPK Balanced Fertilizer 19:19:19',
        category: catFertilizers._id,
        images: ['https://images.unsplash.com/photo-1587834214270-4ec09620effd?w=500&h=500&fit=crop'],
        price: 650,
        shortDescription: 'Balanced NPK 19:19:19 water-soluble fertilizer for high-yield crop nutrition.',
        description: `<p>Fully water-soluble, balanced fertilizer ideal for fertigation and foliar application.</p>`,
        specs: [
          { key: 'Grade', value: 'NPK 19:19:19' },
          { key: 'Solubility', value: '100% water-soluble' },
          { key: 'Application', value: 'Fertigation, Foliar, Soil drench' },
          { key: 'pH', value: '5.5–6.5' },
          { key: 'Pack Size', value: '25 kg bag' },
        ],
        stock: 380,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Neem Cake Fertilizer',
        category: catFertilizers._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 125,
        shortDescription: 'Cold-pressed neem cake — natural soil amendment and pest repellent in one.',
        description: `<p>Natural, organic soil amendment with dual action as fertilizer and bio-pesticide.</p>`,
        specs: [
          { key: 'Nitrogen', value: '4–6%' },
          { key: 'Phosphorus', value: '0.5–1.0%' },
          { key: 'Potassium', value: '1.0–1.5%' },
          { key: 'Azadirachtin', value: '0.2–0.5%' },
          { key: 'Pack Size', value: '50 kg bag' },
        ],
        stock: 500,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Cow Dung Manure',
        category: catFertilizers._id,
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop'],
        price: 95,
        shortDescription: 'Pure, aged cow dung manure for soil enrichment and improved fertility.',
        description: `<p>Aged cow dung manure rich in organic matter. Perfect for all crops and gardens.</p>`,
        specs: [
          { key: 'Nitrogen', value: '0.5–1.5%' },
          { key: 'Organic Matter', value: '>35%' },
          { key: 'Moisture', value: '20–25%' },
          { key: 'C/N Ratio', value: '20:1' },
          { key: 'Pack Size', value: '50 kg bag' },
        ],
        stock: 600,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },

      // Farming Tools & Equipment
      {
        name: 'Professional Hand Trowel Set',
        category: catTools._id,
        images: ['https://images.unsplash.com/photo-1576789177301-e8e736dfcafb?w=500&h=500&fit=crop'],
        price: 850,
        shortDescription: '5-piece stainless steel hand trowel set with ergonomic rubber grip handles.',
        description: `<p>5 essential garden tools including trowel, hand fork, weeder, transplanter, and soil knife.</p>`,
        specs: [
          { key: 'Material', value: 'Stainless Steel 304' },
          { key: 'Handle', value: 'TPR Rubber (ergonomic)' },
          { key: 'Set Contents', value: '5 tools' },
          { key: 'Total Length', value: '22–26 cm per tool' },
          { key: 'Warranty', value: '2 years' },
        ],
        stock: 180,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Heavy Duty Garden Hoe',
        category: catTools._id,
        images: ['https://images.unsplash.com/photo-1563011352-c9d28c21b6f1?w=500&h=500&fit=crop'],
        price: 1200,
        shortDescription: 'Heavy-duty forged steel garden hoe with ash wood handle — for tilling and weeding.',
        description: `<p>Heavy-duty forged high-carbon steel hoe attached via full tang. Built for serious farming work.</p>`,
        specs: [
          { key: 'Blade Material', value: 'Forged HC Steel' },
          { key: 'Handle Material', value: 'Ash Wood' },
          { key: 'Blade Width', value: '18 cm' },
          { key: 'Overall Length', value: '140 cm' },
          { key: 'Weight', value: '1.2 kg' },
        ],
        stock: 120,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Stainless Steel Pruning Shears',
        category: catTools._id,
        images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&h=500&fit=crop'],
        price: 650,
        shortDescription: 'Professional bypass pruning shears with carbon steel blade and safety lock.',
        description: `<p>Premium SK5 carbon steel blade with bypass cutting action for clean, quick healing cuts.</p>`,
        specs: [
          { key: 'Blade Material', value: 'SK5 Carbon Steel' },
          { key: 'Body Material', value: 'Aluminum Alloy' },
          { key: 'Cutting Capacity', value: 'Up to 20 mm diameter' },
          { key: 'Overall Length', value: '21 cm' },
          { key: 'Weight', value: '220g' },
        ],
        stock: 220,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Garden Watering Can',
        category: catTools._id,
        images: ['https://images.unsplash.com/photo-1576789177301-e8e736dfcafb?w=500&h=500&fit=crop'],
        price: 380,
        shortDescription: 'Durable 10L garden watering can with long spout for precise watering.',
        description: `<p>High-quality, durable 10-liter watering can made from UV-resistant plastic.</p>`,
        specs: [
          { key: 'Capacity', value: '10 liters' },
          { key: 'Material', value: 'UV-Resistant Plastic' },
          { key: 'Spout Length', value: '35 cm' },
          { key: 'Handle', value: 'Reinforced grip' },
          { key: 'Weight', value: '500g (empty)' },
        ],
        stock: 300,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },

      // Organic & Pesticides
      {
        name: 'Organic Neem Spray',
        category: catOrganic._id,
        images: ['https://images.unsplash.com/photo-1587880591857-e0a10292c3b9?w=500&h=500&fit=crop'],
        price: 220,
        shortDescription: 'Pure organic neem oil spray — controls pests naturally without chemicals.',
        description: `<p>Pure organic neem oil concentrate for safe, chemical-free pest management on fruits and vegetables.</p>`,
        specs: [
          { key: 'Type', value: 'Pure Neem Oil' },
          { key: 'Concentration', value: '3% Azadirachtin' },
          { key: 'Pack Size', value: '500 ml' },
          { key: 'Usage', value: '1:100 dilution' },
          { key: 'Certification', value: 'NPOP Organic' },
        ],
        stock: 260,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Organic Pest Control Powder',
        category: catOrganic._id,
        images: ['https://images.unsplash.com/photo-1576789177301-e8e736dfcafb?w=500&h=500&fit=crop'],
        price: 160,
        shortDescription: 'Bio-based pest control powder using Beauveria bassiana and Trichoderma.',
        description: `<p>Biological pest control using beneficial microbes. Safe for humans, pets, and the environment.</p>`,
        specs: [
          { key: 'Active Ingredient', value: 'Beauveria bassiana' },
          { key: 'CFU', value: '2×10^8 per gram' },
          { key: 'Pack Size', value: '1 kg' },
          { key: 'Target Pests', value: 'Aphids, whiteflies, spider mites' },
          { key: 'Certification', value: 'NPOP' },
        ],
        stock: 200,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },

      // Vegetable Seeds
      {
        name: 'Tomato Seeds (Hybrid)',
        category: catVeggies._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 280,
        shortDescription: 'High-yielding hybrid tomato seeds resistant to diseases. Perfect for both fields and containers.',
        description: `<p>Disease-resistant hybrid tomato seeds with high yield and uniform size. Ideal for commercial cultivation.</p>`,
        specs: [
          { key: 'Type', value: 'F1 Hybrid' },
          { key: 'Season', value: 'Summer & Rainy' },
          { key: 'Maturity', value: '70–80 days' },
          { key: 'Fruit Weight', value: '120–150g' },
          { key: 'Pack Size', value: '500 seeds' },
        ],
        stock: 310,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Onion Seeds (Bhima Red)',
        category: catVeggies._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 340,
        shortDescription: 'High-yielding onion variety with excellent storage quality and disease resistance.',
        description: `<p>Premium Bhima Red onion seeds with excellent shelf life and superior bulb quality.</p>`,
        specs: [
          { key: 'Variety', value: 'Bhima Red' },
          { key: 'Maturity', value: '130–140 days' },
          { key: 'Bulb Weight', value: '150–200g' },
          { key: 'Storage', value: 'Long shelf life (6-8 months)' },
          { key: 'Pack Size', value: '25g' },
        ],
        stock: 270,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Carrot Seeds (Nantes)',
        category: catVeggies._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 95,
        shortDescription: 'Sweet, crunchy carrot seeds of the Nantes variety. Ideal for fresh market and processing.',
        description: `<p>Premium Nantes carrot seeds producing uniform, orange roots with excellent flavor and sweetness.</p>`,
        specs: [
          { key: 'Variety', value: 'Nantes' },
          { key: 'Maturity', value: '70–80 days' },
          { key: 'Root Length', value: '15–20 cm' },
          { key: 'Color', value: 'Deep Orange' },
          { key: 'Pack Size', value: '5g' },
        ],
        stock: 400,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
      {
        name: 'Spinach Seeds (Palak)',
        category: catVeggies._id,
        images: ['https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2c?w=500&h=500&fit=crop'],
        price: 120,
        shortDescription: 'Leafy, tender spinach seeds for year-round cultivation and quick harvesting.',
        description: `<p>Fast-growing spinach seeds producing tender, nutrient-rich leaves ready in 40-50 days.</p>`,
        specs: [
          { key: 'Variety', value: 'Long Standing' },
          { key: 'Maturity', value: '40–50 days' },
          { key: 'Leaf Color', value: 'Dark Green' },
          { key: 'Bolt Resistance', value: 'High' },
          { key: 'Pack Size', value: '10g' },
        ],
        stock: 350,
        b2bVisible: true,
        b2cVisible: true,
        status: 'active',
      },
    ];

    const products = await Product.create(productData);
    console.log(`✅ ${products.length} products created\n`);

    // ── 5. Create CMS pages ─────────────────────────────────────────────────
    console.log('📄 Creating CMS pages...');
    await CMSPage.create(cmsPages);
    console.log(`✅ ${cmsPages.length} CMS pages created\n`);

    // ── 6. Create testimonials ──────────────────────────────────────────────
    console.log('💬 Creating testimonials...');
    const testimonials = await Testimonial.create([
      {
        name: 'Ramesh Kumar',
        role: 'Wheat Farmer, Punjab',
        content:
          'AgriCommerce has transformed the way I sell my produce. I now get 20–25% better prices compared to selling through local mandis, and the platform is very easy to use even for someone like me who is not very tech-savvy.',
        rating: 5,
        status: 'active',
      },
      {
        name: 'Priya Sharma',
        role: 'Organic Farm Owner, Uttarakhand',
        content:
          'I have been using AgriCommerce for over 2 years to sell my organic vegetables and spices. The team is very supportive, payments are on time, and I have built a loyal customer base across India through this platform.',
        rating: 5,
        status: 'active',
      },
      {
        name: 'Amit Patel',
        role: 'Restaurant Owner, Ahmedabad',
        content:
          'As a restaurant owner who needs consistent quality ingredients, AgriCommerce has been a game-changer. The quality is consistent, the B2B pricing is competitive, and the dedicated account manager makes bulk ordering effortless.',
        rating: 4,
        status: 'active',
      },
    ]);
    console.log(`✅ ${testimonials.length} testimonials created\n`);

    // ── 7. Create homepage content ──────────────────────────────────────────
    console.log('🏠 Creating homepage content...');
    await HomepageContent.create({
      hero: {
        title: 'Fresh From the Farm to Your Doorstep',
        subtitle:
          "India's trusted agricultural marketplace — connecting farmers and buyers for the freshest seeds, spices, fertilizers, and farming tools at fair prices.",
        ctaText: 'Shop Now',
        ctaLink: '/products',
        secondaryCtaText: 'Request Quote',
        secondaryCtaLink: '/enquiry',
        image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200',
      },
      featuredCategories: categories.map((c) => c._id),
      featuredProducts: products.slice(0, 6).map((p) => p._id),
      whyChooseUs: [
        {
          icon: 'shield-check',
          title: 'Quality Assured',
          description:
            'Every product is verified by our agricultural experts before listing. We guarantee 100% genuine, lab-tested products.',
        },
        {
          icon: 'tractor',
          title: 'Direct from Farmers',
          description:
            'We source directly from verified farmers and certified producers, eliminating middlemen for fair prices.',
        },
        {
          icon: 'truck',
          title: 'Fast Delivery',
          description:
            'Pan-India delivery with real-time tracking. Metro cities in 2–4 days, rest of India in 4–10 business days.',
        },
        {
          icon: 'headset',
          title: 'Expert Support',
          description:
            'Our team of agricultural experts is available 6 days a week to guide you on product selection and farming practices.',
        },
      ],
      testimonials: testimonials.map((t) => t._id),
      sections: [
        {
          type: 'cta-banner',
          title: 'Bulk Orders & B2B Solutions',
          subtitle: 'Special pricing for retailers, restaurants, and exporters',
          content:
            'Are you a business looking for reliable agricultural product sourcing? We offer volume discounts, dedicated account management, and flexible payment terms for institutional buyers.',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
          order: 1,
        },
      ],
      footer: {
        tagline: 'Connecting farmers to markets — empowering agriculture across India.',
        copyright: '© 2024 AgriCommerce. All rights reserved.',
      },
    });
    console.log('✅ Homepage content created\n');

    // ── 8. Create site settings ─────────────────────────────────────────────
    console.log('⚙️  Creating site settings...');
    await SiteSettings.create({
      siteName: 'AgriCommerce',
      defaultMode: 'b2c',
      contactInfo: {
        email: 'info@agricommerce.com',
        phone: '+91 98765 43210',
        address: '123 Farmers Market, Connaught Place, New Delhi — 110001',
        whatsapp: '+919876543210',
      },
      socialLinks: {
        facebook: 'https://facebook.com/agricommerce',
        instagram: 'https://instagram.com/agricommerce',
        twitter: 'https://twitter.com/agricommerce',
        linkedin: 'https://linkedin.com/company/agricommerce',
        youtube: 'https://youtube.com/@agricommerce',
      },
      businessDetails: {
        gstNumber: '07AABCU9603R1ZV',
        registrationNumber: 'U01100DL2018PTC328791',
        bankDetails: 'Account: 1234567890, IFSC: HDFC0001234, Bank: HDFC Bank',
      },
      seoDefaults: {
        metaTitle: 'AgriCommerce — India\'s Trusted Agricultural Marketplace',
        metaDescription:
          'Buy premium quality seeds, spices, organic fertilizers, and farming tools directly from verified farmers. Best prices, fast delivery, guaranteed quality.',
      },
    });
    console.log('✅ Site settings created\n');

    // ── 9. Create enquiries ─────────────────────────────────────────────────
    console.log('📋 Creating sample enquiries...');
    const turmericProduct = products.find((p) => p.name === 'Premium Turmeric Powder');
    const wheatProduct = products.find((p) => p.name === 'Hybrid Wheat Seeds');
    const npkProduct = products.find((p) => p.name === 'NPK Balanced Fertilizer 19:19:19');

    if (!turmericProduct || !wheatProduct || !npkProduct) {
      console.warn('⚠️  One or more products not found for enquiry creation. Skipping enquiries.');
    } else {
      await Enquiry.create([
        {
          companyName: 'Spice Masters Exports Pvt. Ltd.',
          contactPerson: 'Suresh Mehta',
          phone: '+91 9812345678',
          email: 'procurement@spicemasters.co.in',
          productName: 'Premium Turmeric Powder',
          productRef: turmericProduct._id,
          quantity: '500 kg per month',
          message:
            'We are an exporter of Indian spices and are looking for a reliable supplier of high-curcumin Lakadong turmeric powder. We require 500 kg per month on a regular basis. Please share your wholesale price list, quality certificates, and minimum order quantity.',
          status: 'New',
        },
        {
          companyName: 'GreenFields Agriculture Ltd.',
          contactPerson: 'Vikram Singh',
          phone: '+91 9876543210',
          email: 'vikram.singh@greenfields.com',
          productName: 'Hybrid Wheat Seeds',
          productRef: wheatProduct._id,
          quantity: '2 metric tons',
          message:
            'We are a seed distribution company operating in UP and Punjab. We are interested in your Hybrid Wheat Seeds for the upcoming Rabi season. We need 2 metric tons of HD-3086 variety. Please confirm availability, bulk pricing, and phytosanitary certificate availability.',
          status: 'In Progress',
        },
        {
          companyName: 'FarmPro Solutions',
          contactPerson: 'Anitha Reddy',
          phone: '+91 9543216789',
          email: 'anitha@farmproolutions.in',
          productName: 'NPK Balanced Fertilizer 19:19:19',
          productRef: npkProduct._id,
          quantity: '100 bags (25 kg each)',
          message:
            'We supply agricultural inputs to a network of 200+ farmers in Telangana. We are looking for consistent supply of NPK 19:19:19 water-soluble fertilizer. Our monthly requirement is approximately 100 bags. Resolved with a 3-month contract. Please send your B2B pricing and payment terms.',
          status: 'Resolved',
        },
      ]);
    }
    console.log('✅ 3 sample enquiries created\n');

    // ── 10. Create orders ───────────────────────────────────────────────────
    console.log('📦 Creating sample orders...');
    const trowelProduct = products.find((p) => p.name === 'Professional Hand Trowel Set');
    const shearProduct = products.find((p) => p.name === 'Stainless Steel Pruning Shears');
    const cornProduct = products.find((p) => p.name === 'Organic Corn Seeds');
    const vermiProduct = products.find((p) => p.name === 'Vermicompost Organic Fertilizer');
    const hoeProduct = products.find((p) => p.name === 'Heavy Duty Garden Hoe');

    if (!trowelProduct || !shearProduct || !cornProduct || !vermiProduct || !hoeProduct) {
      console.warn('⚠️  One or more products not found for order creation. Skipping orders.');
    } else {
      await Order.create([
        {
          customer: {
            name: 'Ravi Shankar',
            email: 'ravi.shankar@gmail.com',
            phone: '+91 9512345678',
            address: {
              street: '45, Sector 12, Dwarka',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110075',
            },
          },
          items: [
            {
              product: trowelProduct._id,
              name: trowelProduct.name,
              price: trowelProduct.price,
              quantity: 1,
            },
            {
              product: cornProduct._id,
              name: cornProduct.name,
              price: cornProduct.price,
              quantity: 2,
            },
          ],
          total: trowelProduct.price * 1 + cornProduct.price * 2,
          status: 'Pending',
          notes: 'Please ensure seeds are packed in airtight packaging.',
        },
        {
          customer: {
            name: 'Meena Gupta',
            email: 'meena.gupta@yahoo.com',
            phone: '+91 9876501234',
            address: {
              street: '12, Gandhi Nagar, Ring Road',
              city: 'Lucknow',
              state: 'Uttar Pradesh',
              pincode: '226001',
            },
          },
          items: [
            {
              product: vermiProduct._id,
              name: vermiProduct.name,
              price: vermiProduct.price,
              quantity: 3,
            },
            {
              product: shearProduct._id,
              name: shearProduct.name,
              price: shearProduct.price,
              quantity: 1,
            },
          ],
          total: vermiProduct.price * 3 + shearProduct.price * 1,
          status: 'Processing',
          notes: 'Leave at doorstep if no one home.',
        },
        {
          customer: {
            name: 'Ajay Patil',
            email: 'ajay.patil@hotmail.com',
            phone: '+91 9012345678',
            address: {
              street: '8, Shivaji Nagar, Pune-Nashik Road',
              city: 'Pune',
              state: 'Maharashtra',
              pincode: '411005',
            },
          },
          items: [
            {
              product: hoeProduct._id,
              name: hoeProduct.name,
              price: hoeProduct.price,
              quantity: 1,
            },
          ],
          total: hoeProduct.price * 1,
          status: 'Delivered',
          notes: '',
        },
      ]);
    }
    console.log('✅ 3 sample orders created\n');

    // ── 11. Create banners ──────────────────────────────────────────────────
    console.log('🖼️  Creating banners...');
    await Banner.create([
      {
        title: 'Kharif Season Sale',
        subtitle: 'Up to 30% off on selected seeds and fertilizers this season',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200',
        link: '/products?category=' + catSeeds._id,
        buttonText: 'Shop Seeds',
        position: 1,
        status: 'active',
      },
      {
        title: 'Bulk Order Discounts',
        subtitle: 'Special B2B pricing for retailers, restaurants & exporters — submit your enquiry today',
        image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200',
        link: '/enquiry',
        buttonText: 'Get Quote',
        position: 2,
        status: 'active',
      },
    ]);
    console.log('✅ 2 banners created\n');

    // ── Done ────────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Admin credentials:');
    console.log('  Email:    admin@agri.com');
    console.log('  Password: Admin@1234');
    console.log('───────────────────────────────────────────────────────────');
    console.log('Summary:');
    console.log('  ✅ 1 admin user');
    console.log('  ✅ 6 categories');
    console.log('  ✅ 22 products (all in stock)');
    console.log('  ✅ 7 CMS pages');
    console.log('  ✅ 3 testimonials');
    console.log('  ✅ 1 homepage content document');
    console.log('  ✅ 1 site settings document');
    console.log('  ✅ 3 enquiries');
    console.log('  ✅ 3 orders');
    console.log('  ✅ 2 banners');
    console.log('═══════════════════════════════════════════════════════════');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB. Goodbye!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    if (error.errors) {
      Object.values(error.errors).forEach((e) => console.error(' -', e.message));
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
