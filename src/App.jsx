import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaClock, FaParking, FaUtensils, FaShoppingBag, FaPercent, FaMapMarkerAlt, FaTrash, FaMoon, FaSun, FaMicrophone, FaMapMarked } from 'react-icons/fa';
import Message from './components/Message';
import MallMap from './components/MallMap';

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-bl-none max-w-[80%] shadow-sm">
      <div className="flex space-x-3">
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

// Quick response button
const QuickResponseButton = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white hover:bg-gray-50 rounded-full text-xs sm:text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-sm border border-gray-200"
  >
    <span className="text-blue-500">{icon}</span>
    <span className="text-gray-700">{text}</span>
  </button>
);

export default function App() {
  const [messages, setMessages] = useState([
    { 
      text: "Welcome to the Shopping Mall Assistant! I can help you with information about our stores, restaurants, services, facilities, and events. What would you like to know about the mall today?", 
      sender: "bot",
      timestamp: new Date().toISOString(),
      suggestedQuestions: [
        "What are the mall hours?",
        "Where can I park?",
        "What stores do you have?",
        "Where can I eat?",
        "Are there any sales today?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const messagesEndRef = useRef(null);
  const [isMallOpen, setIsMallOpen] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Add a font size state
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'
  const [refreshProgress, setRefreshProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if mall is currently open
  useEffect(() => {
    const checkMallHours = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1-6 is Monday-Saturday
      const hour = now.getHours();
      
      if (day === 0) { // Sunday
        setIsMallOpen(hour >= 11 && hour < 19);
      } else { // Monday-Saturday
        setIsMallOpen(hour >= 10 && hour < 21);
      }
    };
    
    checkMallHours();
    const interval = setInterval(checkMallHours, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) { // Don't save just the welcome message
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Check system preference on mount
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const processUserInput = (input) => {
    // Add user message
    const userMessage = { 
      text: input, 
      sender: "user",
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Hide quick responses after user's first message
    if (showQuickResponses) {
      setShowQuickResponses(false);
    }

    // Show typing indicator
    setIsTyping(true);

    // Generate bot response after a short delay
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateResponse(input);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: botResponse.text, 
          sender: "bot",
          timestamp: new Date().toISOString(),
          suggestedQuestions: botResponse.suggestedQuestions
        }
      ]);
    }, 1200);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processUserInput(inputValue);
  };

  const handleQuickResponse = (query) => {
    processUserInput(query);
  };

  const handleSuggestedQuestionClick = (question) => {
    processUserInput(question);
  };

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let response = {
      text: "",
      suggestedQuestions: []
    };
    
    if (input.includes('hours') || input.includes('timing') || input.includes('open')) {
      const now = new Date();
      const day = now.getDay();
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      
      response.text = `The mall is open from 10:00 AM to 9:00 PM Monday through Saturday, and 11:00 AM to 7:00 PM on Sunday. ${
        isMallOpen ? "We're currently open!" : "We're currently closed."
      } Today is ${dayNames[day]}.`;
      response.suggestedQuestions = [
        "Where can I park?",
        "What stores are on the first floor?",
        "Are there any events today?"
      ];
    } else if (input.includes('parking') || input.includes('park')) {
      response.text = "We have parking available on levels P1-P3. The first 2 hours are free with any purchase. Valet parking is also available at the main entrance for $15.";
      response.suggestedQuestions = [
        "How do I get to the food court?",
        "Is there EV charging available?",
        "Where are the mall entrances?"
      ];
    } else if (input.includes('restroom') || input.includes('bathroom') || input.includes('toilet')) {
      response.text = "Restrooms are located on each floor near the elevators and food court. Family restrooms are available on floors 1 and 3.";
      response.suggestedQuestions = [
        "Where are the elevators?",
        "Is there a nursing room?",
        "Where is the nearest water fountain?"
      ];
    } else if (input.includes('food') || input.includes('restaurant') || input.includes('eat') || input.includes('dining')) {
      if (input.includes('fast') || input.includes('quick')) {
        response.text = "Our fast food options include McDonald's, Burger King, Taco Bell, and Subway in the food court on the 3rd floor. For quick-service with higher quality, try ShakeShack or Chipotle also on the 3rd floor.";
        response.suggestedQuestions = [
          "Where is the food court located?",
          "Which fast food place has the shortest lines usually?",
          "Are there any healthy fast food options?"
        ];
      } else if (input.includes('sit') || input.includes('dine') || input.includes('formal')) {
        response.text = "Our sit-down restaurants include 'The Garden Terrace' (American), 'Ocean Blue' (Seafood), and 'Bella Italia' (Italian) on the 4th floor. For a special experience, try 'Sky View Restaurant' on the top floor with panoramic views of the city.";
        response.suggestedQuestions = [
          "Do I need reservations for these restaurants?",
          "Which restaurant is best for a special occasion?",
          "Do any restaurants have outdoor seating?"
        ];
      } else if (input.includes('coffee') || input.includes('cafe')) {
        response.text = "Coffee shops include Starbucks (1st & 3rd floors), Local Brew Cafe (2nd floor), and Espresso Express near the main entrance. The Book Cafe inside Barnes & Noble also serves excellent coffee and pastries.";
        response.suggestedQuestions = [
          "Which coffee shop has the best pastries?",
          "Is there a quiet coffee shop for working?",
          "Do any coffee shops offer specialty drinks?"
        ];
      } else if (input.includes('dessert') || input.includes('ice cream') || input.includes('sweet')) {
        response.text = "For desserts, visit Sweet Treats, Cinnabon, and Coldstone Creamery in the food court. Godiva Chocolatier is on the 2nd floor, and there's a delightful French patisserie called 'Le Petit Gateau' on the 4th floor.";
        response.suggestedQuestions = [
          "Which place has the best ice cream?",
          "Do you have any bakeries in the mall?",
          "Are there any dessert places with vegan options?"
        ];
      } else if (input.includes('asian') || input.includes('chinese') || input.includes('japanese') || input.includes('thai')) {
        response.text = "Asian cuisine options include Panda Express and Sarku Japan in the food court. For sit-down Asian dining, try 'Golden Dragon' (Chinese), 'Tokyo Sushi' (Japanese), and 'Bangkok Spice' (Thai) on the 4th floor.";
        response.suggestedQuestions = [
          "Which restaurant has the best sushi?",
          "Are there any Korean food options?",
          "Do these restaurants offer vegetarian dishes?"
        ];
      } else if (input.includes('italian') || input.includes('pizza') || input.includes('pasta')) {
        response.text = "Italian options include Sbarro in the food court, and sit-down restaurants like 'Bella Italia' and 'Pasta Paradise' on the 4th floor. 'Authentic Pizza' on the 3rd floor offers wood-fired Neapolitan style pizzas.";
        response.suggestedQuestions = [
          "Which restaurant has the best pizza?",
          "Do any Italian restaurants offer gluten-free pasta?",
          "Which place is good for a family Italian dinner?"
        ];
      } else if (input.includes('vegetarian') || input.includes('vegan') || input.includes('plant')) {
        response.text = "Vegetarian and vegan options are available at Green Leaf Cafe on the 3rd floor. Most of our restaurants also offer vegetarian menu items, with 'Healthy Harvest' in the food court specializing in plant-based fast food.";
        response.suggestedQuestions = [
          "Which restaurant has the best vegetarian selection?",
          "Are there any vegan dessert options?",
          "Do you have any gluten-free and vegan options?"
        ];
      } else if (input.includes('allergen') || input.includes('gluten') || input.includes('allergy')) {
        response.text = "Many of our restaurants accommodate dietary restrictions. 'Pure Kitchen' on the 3rd floor specializes in allergen-friendly foods, with gluten-free, nut-free, and dairy-free options clearly marked. Always inform staff about serious allergies.";
        response.suggestedQuestions = [
          "Which restaurants have gluten-free menus?",
          "Are there any dairy-free options in the food court?",
          "Do restaurants label allergens on their menus?"
        ];
      } else {
        response.text = "Our food court is on the 3rd floor, with over 15 restaurants including Italian, Asian, and American cuisines. We also have sit-down restaurants like 'The Garden Terrace' and 'Ocean Blue' on the 4th floor. Coffee shops and quick snacks are available throughout the mall.";
        response.suggestedQuestions = [
          "What are the food court hours?",
          "Which restaurants take reservations?",
          "What's the most popular restaurant in the mall?"
        ];
      }
    } else if (input.includes('store') || input.includes('shop')) {
      if (input.includes('fashion') || input.includes('cloth') || input.includes('wear')) {
        if (input.includes('men')) {
          response.text = "Men's fashion is available at Zara Men, H&M Men's Department, and Brooks Brothers on the 2nd floor. For luxury menswear, check out Hugo Boss and Armani on the 4th floor.";
          response.suggestedQuestions = [
            "Where can I find men's shoes?",
            "Are there any sales on men's clothing?",
            "Which store has business attire for men?"
          ];
        } else if (input.includes('women')) {
          response.text = "Women's fashion is available at Zara, H&M, Macy's, and Forever 21 on the 1st and 2nd floors. Designer women's clothing can be found at Michael Kors, Coach, and Kate Spade on the 4th floor.";
          response.suggestedQuestions = [
            "Where can I find women's shoes?",
            "Which store has formal dresses?",
            "Are there any makeup stores nearby?"
          ];
        } else if (input.includes('kid') || input.includes('child')) {
          response.text = "Children's clothing can be found at Kids Fashion Zone, Baby Gap, and Children's Place on the 3rd floor. We also have specialty stores like Tiny Tots for infants and Teen Style for older kids.";
          response.suggestedQuestions = [
            "Do you have stores for baby clothes?",
            "Where can I find children's shoes?",
            "Are there any toy stores near the children's clothing?"
          ];
        } else if (input.includes('shoe')) {
          response.text = "Our shoe stores include Foot Locker, Nike, Aldo, and DSW on the 2nd floor. For luxury footwear, visit Jimmy Choo and Christian Louboutin on the 4th floor.";
          response.suggestedQuestions = [
            "Do you have any sports shoe stores?",
            "Where can I find children's shoes?",
            "Are there any shoe repair services?"
          ];
        } else if (input.includes('sport') || input.includes('athletic')) {
          response.text = "Sports and athletic wear can be found at Nike, Adidas, Under Armour, and Lululemon on the 2nd floor. We also have specialty stores like Runner's Paradise and Outdoor Adventure Gear.";
          response.suggestedQuestions = [
            "Do you sell sports equipment too?",
            "Where can I find running shoes?",
            "Are there any sales on athletic wear?"
          ];
        } else {
          response.text = "Our fashion stores include Zara, H&M, Uniqlo, and Macy's on floors 1-2. Luxury brands like Gucci and Louis Vuitton are on the 4th floor. We have sections for men's, women's, and children's fashion throughout the mall.";
          response.suggestedQuestions = [
            "Where are the shoe stores?",
            "Which floor has luxury brands?",
            "Are there any sports apparel stores?"
          ];
        }
      } else if (input.includes('tech') || input.includes('electronic')) {
        if (input.includes('phone') || input.includes('mobile') || input.includes('cell')) {
          response.text = "For mobile phones and accessories, visit the Apple Store on the 1st floor, Samsung Experience on the 2nd floor, or Mobile World which carries all major brands on the 2nd floor. Carrier stores like Verizon and AT&T are also available.";
          response.suggestedQuestions = [
            "Where can I get my phone repaired?",
            "Do you have phone case stores?",
            "Which store sells unlocked phones?"
          ];
        } else if (input.includes('computer') || input.includes('laptop')) {
          response.text = "Computers and laptops are available at the Apple Store, Microsoft Store, and TechWorld on the 2nd floor. BestBuy also has an extensive selection of computers and accessories.";
          response.suggestedQuestions = [
            "Where can I get computer repairs?",
            "Which store has gaming laptops?",
            "Do you have stores that sell computer parts?"
          ];
        } else if (input.includes('game') || input.includes('gaming')) {
          response.text = "Video games and gaming equipment can be found at GameStop, Game World, and the electronics section of BestBuy. PC gaming gear is available at TechWorld and the Microsoft Store on the 2nd floor.";
          response.suggestedQuestions = [
            "Do you have any arcade or gaming centers?",
            "Where can I find gaming consoles?",
            "Which store has the latest game releases?"
          ];
        } else if (input.includes('camera') || input.includes('photo')) {
          response.text = "Cameras and photography equipment are available at Camera World on the 2nd floor, as well as in the electronics section of BestBuy. The Apple Store and TechWorld also carry popular camera models.";
          response.suggestedQuestions = [
            "Is there a photo printing service?",
            "Where can I find camera accessories?",
            "Do you have any stores with vintage cameras?"
          ];
        } else {
          response.text = "For electronics, check out TechWorld on the 2nd floor, Apple Store on the 1st floor, or Gadget Galaxy on the 3rd floor. BestBuy has a large selection of all electronics including TVs, computers, audio equipment, and smart home devices.";
          response.suggestedQuestions = [
            "Where can I find mobile phones?",
            "Which store has computer accessories?",
            "Do you have any stores for smart home devices?"
          ];
        }
      } else if (input.includes('home') || input.includes('furniture') || input.includes('decor')) {
        response.text = "Home goods and furniture are available at HomeStyle, Bed Bath & Beyond, and Pottery Barn on the 3rd floor. For luxury home decor, check out Design Studio and Elegant Home on the 4th floor.";
        response.suggestedQuestions = [
          "Do you have any kitchen specialty stores?",
          "Where can I find bedding and linens?",
          "Are there any stores for home organization?"
        ];
      } else if (input.includes('beauty') || input.includes('cosmetic') || input.includes('makeup')) {
        response.text = "Beauty and cosmetics can be found at Sephora and Ulta on the 1st floor. We also have MAC, Lush, The Body Shop, and department store beauty counters at Macy's and Nordstrom.";
        response.suggestedQuestions = [
          "Do you have any skincare specialty stores?",
          "Where can I find fragrances and perfumes?",
          "Are there any clean beauty brands?"
        ];
      } else if (input.includes('book') || input.includes('read')) {
        response.text = "Books and reading materials are available at Barnes & Noble on the 3rd floor. We also have specialty bookstores like Kids' Books and Travel Reads near the food court.";
        response.suggestedQuestions = [
          "Do you have any comic book stores?",
          "Where can I find magazines?",
          "Is there a place to sit and read in the bookstore?"
        ];
      } else if (input.includes('jewelry') || input.includes('watch')) {
        response.text = "Jewelry and watches can be found at Tiffany & Co., Pandora, and Swarovski on the 4th floor. For watches specifically, check out Watch World and the luxury watch sections at department stores.";
        response.suggestedQuestions = [
          "Do you have any jewelry repair services?",
          "Where can I find affordable jewelry?",
          "Which store sells engagement rings?"
        ];
      } else if (input.includes('toy') || input.includes('kid')) {
        response.text = "Kid's stores and toy shops are on the 3rd floor, including Toys R Fun, Kids Paradise, and Baby Boutique. We also have specialty stores like Build-A-Bear Workshop and LEGO Store.";
        response.suggestedQuestions = [
          "Where can I find educational toys?",
          "Are there any video game stores for kids?",
          "Do you have a store that sells board games?"
        ];
      } else {
        response.text = "We have over 150 stores including fashion, electronics, home goods, beauty, books, jewelry, toys, and more. Is there a specific category you're interested in?";
        response.suggestedQuestions = [
          "What are the newest stores in the mall?",
          "Which stores are most popular?",
          "Where can I find the mall directory?"
        ];
      }
    } else if (input.includes('sale') || input.includes('discount') || input.includes('offer') || input.includes('deal')) {
      response.text = "Currently we have summer sales in most fashion stores with discounts up to 50%. The electronics stores are also offering back-to-school specials. Check our app for daily deals!";
      response.suggestedQuestions = [
        "Are there any clearance items?",
        "How often do sales occur?",
        "Do you have a loyalty program for additional discounts?"
      ];
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      response.text = "Hello! How can I assist you with the shopping mall today?";
    } else if (input.includes('thank')) {
      response.text = "You're welcome! Feel free to ask if you need anything else. Enjoy your shopping experience!";
    } else if (input.includes('location') || input.includes('address') || input.includes('where')) {
      response.text = "We're located at 123 Shopping Avenue, Downtown. You can find us easily using Google Maps! Our nearest public transit station is Central Station, just a 5-minute walk away.";
    } else if (input.includes('wifi') || input.includes('internet')) {
      response.text = "Free WiFi is available throughout the mall. Connect to 'Mall-Guest' network and accept the terms. The password is 'ShopHappy2023'.";
    } else if (input.includes('event') || input.includes('entertainment') || input.includes('show') || input.includes('performance')) {
      const currentMonth = new Date().getMonth();
      let seasonalEvents = "";
      
      // Add seasonal events based on current month
      if (currentMonth >= 0 && currentMonth <= 1) { // Jan-Feb
        seasonalEvents = "This winter, we're hosting the 'Winter Wonderland' exhibit in the central atrium with an ice sculpture display.";
      } else if (currentMonth >= 2 && currentMonth <= 4) { // Mar-May
        seasonalEvents = "This spring, we're featuring flower shows every weekend and special Easter events in April.";
      } else if (currentMonth >= 5 && currentMonth <= 7) { // Jun-Aug
        seasonalEvents = "Our summer concert series is happening every Friday night in the outdoor plaza with local bands.";
      } else if (currentMonth >= 8 && currentMonth <= 9) { // Sep-Oct
        seasonalEvents = "Our Fall Fashion Show is happening this month, showcasing the latest autumn collections.";
      } else { // Nov-Dec
        seasonalEvents = "Holiday events include Santa's Village in the central atrium, a giant Christmas tree lighting ceremony, and extended shopping hours.";
      }
      
      response.text = `We have a weekend concert series in the central plaza every Saturday at 6 PM. This weekend features local band 'The Shoppers'. There's also a fashion show on the 2nd floor at 3 PM this Sunday! ${seasonalEvents} Check the events board near the main entrance for a complete schedule.`;
      response.suggestedQuestions = [
        "Are there any children's events?",
        "Do I need tickets for the weekend concerts?",
        "What events are happening next month?"
      ];
    } else if (input.includes('holiday') || input.includes('christmas') || input.includes('thanksgiving') || input.includes('halloween')) {
      const currentMonth = new Date().getMonth();
      let holidayInfo = "";
      
      if (currentMonth >= 0 && currentMonth <= 1) { // Jan-Feb
        holidayInfo = "We're currently featuring Valentine's Day specials at many of our stores. Look for the heart symbols for special deals and gift ideas.";
      } else if (currentMonth >= 2 && currentMonth <= 4) { // Mar-May
        holidayInfo = "We're currently preparing for Mother's Day with special promotions in our jewelry, fashion, and beauty stores.";
      } else if (currentMonth >= 5 && currentMonth <= 7) { // Jun-Aug
        holidayInfo = "Back-to-school specials will begin next month with discounts at our clothing, electronics, and book stores.";
      } else if (currentMonth >= 8 && currentMonth <= 9) { // Sep-Oct
        holidayInfo = "Halloween decorations and costumes are now available at various stores on the 3rd floor. We'll also have trick-or-treating in the mall on Halloween.";
      } else { // Nov-Dec
        holidayInfo = "Our mall is decorated for the holidays! Extended holiday hours begin on November 25th. Santa's Village is open daily in the central atrium for photos.";
      }
      
      response.text = `${holidayInfo} During major holidays, the mall often has extended or reduced hours. Please check our website or call ahead on major holidays.`;
      response.suggestedQuestions = [
        "What are the mall hours on holidays?",
        "Are there any special holiday sales?",
        "Do you have holiday gift wrapping services?"
      ];
    } else if (input.includes('clear') || input.includes('reset') || input.includes('start over')) {
      setTimeout(() => {
        setMessages([{ 
          text: "Welcome to the Shopping Mall Assistant! I can help you with information about our stores, restaurants, services, facilities, and events. What would you like to know about the mall today?", 
          sender: "bot",
          timestamp: new Date().toISOString(),
          suggestedQuestions: [
            "What are the mall hours?",
            "Where can I park?",
            "What stores do you have?",
            "Where can I eat?",
            "Are there any sales today?"
          ]
        }]);
        setShowQuickResponses(true);
        localStorage.removeItem('chatHistory');
      }, 500);
      response.text = "I've reset our conversation. How can I help you today?";
    } else if (input.includes('help') || input.includes('what can you do') || input.includes('capability')) {
      response.text = "I'm the Shopping Mall Assistant and can help you with:\n\n" +
        "• Mall hours and holiday schedules\n" +
        "• Store locations and categories\n" +
        "• Restaurant and food options\n" +
        "• Current sales and promotions\n" +
        "• Parking information\n" +
        "• Restroom locations\n" +
        "• Accessibility services\n" +
        "• Events and entertainment\n" +
        "• Mall facilities (ATMs, charging stations, etc.)\n\n" +
        "I'm focused on helping you navigate our shopping mall. For other topics, please visit our customer service desk.";
      response.suggestedQuestions = [
        "What stores are in the mall?",
        "Where is the food court?",
        "Are there any sales today?",
        "What are the mall hours?"
      ];
    } else if (
      input.includes('weather') || 
      input.includes('stock') || 
      input.includes('president') || 
      input.includes('politics') || 
      input.includes('sports') ||
      input.includes('news')
    ) {
      response.text = "I'm a shopping mall assistant and can only provide information about our mall, stores, and services. For information about " + 
        (input.includes('weather') ? "weather" : 
         input.includes('stock') ? "stocks" : 
         input.includes('president') || input.includes('politics') ? "politics" : 
         input.includes('sports') ? "sports" : "other topics") + 
        ", please check specialized services or websites.";
      response.suggestedQuestions = [
        "What stores are in the mall?",
        "Where is the food court?",
        "What are the mall hours?"
      ];
    } else if (input.includes('recommend') || input.includes('suggestion') || input.includes('gift idea') || input.includes('shopping for')) {
      if (input.includes('women') || input.includes('wife') || input.includes('girlfriend') || input.includes('mom') || input.includes('mother')) {
        response.text = "For women's gifts, I'd recommend visiting our jewelry stores like Pandora or Swarovski on the 4th floor. Beauty gifts from Sephora or perfume from Fragrance Boutique are also popular. For fashion, check out the boutiques on the 2nd floor or Michael Kors for accessories.";
        response.suggestedQuestions = [
          "Where can I find women's jewelry?",
          "What beauty stores do you recommend?",
          "Are there any spa gift certificates available?"
        ];
      } else if (input.includes('men') || input.includes('husband') || input.includes('boyfriend') || input.includes('dad') || input.includes('father')) {
        response.text = "For men's gifts, check out our electronics stores like TechWorld or the Apple Store. For fashion, visit Hugo Boss or Brooks Brothers on the 2nd floor. The Gadget Gallery has unique tech accessories, and Premium Leather Goods offers quality wallets and bags.";
        response.suggestedQuestions = [
          "Where can I find men's watches?",
          "Which store sells premium wallets?",
          "Do you have any sports merchandise stores?"
        ];
      } else if (input.includes('teen') || input.includes('teenager')) {
        response.text = "For teens, popular stores include Urban Outfitters, Hollister, and GameStop. Tech accessories from Gadget Gallery or the Apple Store are also good options. For athletic teens, check out Nike or Adidas on the 2nd floor.";
        response.suggestedQuestions = [
          "Where are the teen fashion stores?",
          "Which stores sell video games?",
          "Do you have any trendy accessory stores?"
        ];
      } else if (input.includes('kid') || input.includes('child')) {
        response.text = "For children, visit our toy stores on the 3rd floor including Toys R Fun and the LEGO Store. For educational gifts, check out Learning Center or the children's section at Barnes & Noble. Kids' fashion is available at Children's Place and Gap Kids.";
        response.suggestedQuestions = [
          "What age ranges do your toy stores cater to?",
          "Where can I find educational toys?",
          "Do you have any children's book stores?"
        ];
      } else {
        response.text = "For gift recommendations, our Customer Service desk on the 1st floor offers personal shopping assistance. Popular gift options include electronics (2nd floor), jewelry (4th floor), fashion accessories (throughout mall), and gift cards available at Customer Service.";
        response.suggestedQuestions = [
          "Do you have mall gift cards?",
          "Where can I find unique gifts?",
          "Which stores offer gift wrapping?"
        ];
      }
    } else {
      response.text = "I'm not sure I understand. I'm a shopping mall assistant and can help with questions about our mall's stores, restaurants, services, and facilities. For example, you can ask about store locations, restaurant recommendations, current sales, or mall amenities.";
      response.suggestedQuestions = [
        "What stores do you have?",
        "Where can I eat?",
        "What are the mall hours?",
        "Help me find something specific",
        "Tell me about mall services"
      ];
    }
    
    return response;
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Add this effect to handle swipe to scroll
  useEffect(() => {
    // Only run on mobile devices
    if (window.innerWidth < 640) {
      const messagesContainer = document.querySelector('.messages-container');
      
      let touchStart = null;
      
      const handleTouchStart = (e) => {
        touchStart = e.touches[0].clientY;
      };
      
      const handleTouchMove = (e) => {
        if (touchStart === null) return;
        
        const touchEnd = e.touches[0].clientY;
        const diff = touchStart - touchEnd;
        
        // Add smooth scrolling based on touch movement
        messagesContainer.scrollTop += diff * 0.6;
        touchStart = touchEnd;
      };
      
      const handleTouchEnd = () => {
        touchStart = null;
      };
      
      if (messagesContainer) {
        messagesContainer.addEventListener('touchstart', handleTouchStart);
        messagesContainer.addEventListener('touchmove', handleTouchMove);
        messagesContainer.addEventListener('touchend', handleTouchEnd);
        
        return () => {
          messagesContainer.removeEventListener('touchstart', handleTouchStart);
          messagesContainer.removeEventListener('touchmove', handleTouchMove);
          messagesContainer.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }
  }, []);

  // Add pull to refresh functionality
  useEffect(() => {
    // Only run on mobile devices
    if (window.innerWidth < 640) {
      const messagesContainer = document.querySelector('.messages-container');
      let startY = 0;
      
      const handleTouchStart = (e) => {
        if (messagesContainer.scrollTop === 0) {
          startY = e.touches[0].clientY;
        }
      };
      
      const handleTouchMove = (e) => {
        if (messagesContainer.scrollTop === 0 && startY > 0) {
          const pull = e.touches[0].clientY - startY;
          if (pull > 0) {
            setRefreshProgress(Math.min(pull / 100, 1));
            if (pull > 70) {
              setIsRefreshing(true);
            }
          }
        }
      };
      
      const handleTouchEnd = () => {
        if (isRefreshing) {
          // Reset chat
          setMessages([{ 
            text: "Welcome to the Shopping Mall Assistant! I can help you with information about our stores, restaurants, services, facilities, and events. What would you like to know about the mall today?", 
            sender: "bot",
            timestamp: new Date().toISOString(),
            suggestedQuestions: [
              "What are the mall hours?",
              "Where can I park?",
              "What stores do you have?",
              "Where can I eat?",
              "Are there any sales today?"
            ]
          }]);
          setShowQuickResponses(true);
          localStorage.removeItem('chatHistory');
        }
        
        setRefreshProgress(0);
        setIsRefreshing(false);
        startY = 0;
      };
      
      if (messagesContainer) {
        messagesContainer.addEventListener('touchstart', handleTouchStart);
        messagesContainer.addEventListener('touchmove', handleTouchMove);
        messagesContainer.addEventListener('touchend', handleTouchEnd);
        
        return () => {
          messagesContainer.removeEventListener('touchstart', handleTouchStart);
          messagesContainer.removeEventListener('touchmove', handleTouchMove);
          messagesContainer.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }
  }, [isRefreshing]);

  return (
    <div className={`flex justify-center items-center min-h-screen ${
      darkMode 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    } p-2 sm:p-4 transition-colors duration-300`}>
      <div className={`w-full max-w-md sm:max-w-lg md:max-w-xl h-[85vh] sm:h-[600px] md:h-[700px] ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-xl shadow-xl flex flex-col overflow-hidden border transition-colors duration-300`}>
        {/* Header */}
        <div className={`${
          darkMode 
            ? 'bg-gradient-to-r from-blue-800 to-blue-900' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700'
        } text-white p-3 sm:p-4 flex flex-col transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white p-1 sm:p-2 rounded-full">
                <FaRobot className="text-blue-600 text-lg sm:text-xl" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">Mall Assistant</h1>
                <p className="text-[10px] sm:text-xs text-blue-100">
                  {isMallOpen !== null ? (
                    <span className="flex items-center gap-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${isMallOpen ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      {isMallOpen ? "Mall is open now" : "Mall is closed now"}
                    </span>
                  ) : "Loading mall status..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setDarkMode(prev => !prev)}
                className="p-1 sm:p-2 rounded-full bg-opacity-20 bg-black hover:bg-opacity-30 transition-all"
              >
                {darkMode ? <FaSun size={12} className="sm:text-[14px]" /> : <FaMoon size={12} className="sm:text-[14px]" />}
              </button>
              <button
                onClick={() => {
                  setFontSize(current => 
                    current === 'small' ? 'normal' : 
                    current === 'normal' ? 'large' : 'small'
                  );
                }}
                className="p-1 sm:p-2 rounded-full bg-opacity-20 bg-black hover:bg-opacity-30 transition-all"
                aria-label="Change text size"
                title="Change text size"
              >
                <span className="text-[10px] sm:text-xs">Aa</span>
              </button>
              <button 
                onClick={() => {
                  setMessages([{ 
                    text: "Welcome to the Shopping Mall Assistant! I can help you with information about our stores, restaurants, services, facilities, and events. What would you like to know about the mall today?", 
                    sender: "bot",
                    timestamp: new Date().toISOString(),
                    suggestedQuestions: [
                      "What are the mall hours?",
                      "Where can I park?",
                      "What stores do you have?",
                      "Where can I eat?",
                      "Are there any sales today?"
                    ]
                  }]);
                  setShowQuickResponses(true);
                  localStorage.removeItem('chatHistory');
                }}
                className="text-[10px] sm:text-xs bg-blue-700 hover:bg-blue-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1"
              >
                <FaTrash size={10} className="sm:text-[12px]" /> <span>Reset</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-1 italic">Ask me about mall stores, restaurants, facilities & services</p>
        </div>
        
        {/* Messages */}
        <div className={`flex-1 p-2 sm:p-4 overflow-y-auto flex flex-col gap-2 sm:gap-3 messages-container ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="text-center text-xs text-gray-400 mb-2 refresh-indicator" style={{opacity: refreshProgress}}>
            Pull down to refresh conversation
          </div>
          
          {isLoading ? (
            <div className={`flex-1 p-4 overflow-y-auto flex flex-col gap-3 ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <MessageSkeleton darkMode={darkMode} />
              <MessageSkeleton darkMode={darkMode} />
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className="animate-fadeIn" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Message 
                  message={message} 
                  isLastMessage={index === messages.length - 1 && message.sender === 'user'}
                  onSuggestedQuestionClick={handleSuggestedQuestionClick}
                  darkMode={darkMode}
                  fontSize={fontSize}
                />
              </div>
            ))
          )}
          
          {isTyping && <TypingIndicator />}
          
          {/* Quick response buttons */}
          {showQuickResponses && messages.length <= 2 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                <QuickResponseButton 
                  icon={<FaClock className="text-blue-500" />} 
                  text="Opening Hours" 
                  onClick={() => handleQuickResponse("What are the mall hours?")}
                />
                <QuickResponseButton 
                  icon={<FaParking className="text-blue-500" />} 
                  text="Parking" 
                  onClick={() => handleQuickResponse("Where can I park?")}
                />
                <QuickResponseButton 
                  icon={<FaUtensils className="text-blue-500" />} 
                  text="Restaurants" 
                  onClick={() => handleQuickResponse("Where can I eat?")}
                />
                <QuickResponseButton 
                  icon={<FaShoppingBag className="text-blue-500" />} 
                  text="Stores" 
                  onClick={() => handleQuickResponse("What stores do you have?")}
                />
                <QuickResponseButton 
                  icon={<FaPercent className="text-blue-500" />} 
                  text="Sales" 
                  onClick={() => handleQuickResponse("Any sales today?")}
                />
                <QuickResponseButton 
                  icon={<FaMapMarkerAlt className="text-blue-500" />} 
                  text="Location" 
                  onClick={() => handleQuickResponse("Where is the mall located?")}
                />
                <QuickResponseButton 
                  icon={<FaMapMarked className="text-blue-500" />} 
                  text="Mall Map" 
                  onClick={() => setShowMap(true)}
                />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Map component */}
        {showMap && (
          <div className="relative">
            <MallMap onClose={() => setShowMap(false)} />
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              onClick={() => setShowMap(false)}
              aria-label="Close map"
            >
              <FaTimes />
            </button>
          </div>
        )}
        
        {/* Input */}
        <form 
          className={`p-2 sm:p-3 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center gap-2`}
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question here..."
            className={`flex-1 py-2 px-3 sm:px-4 border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm`}
          />
          
          {/* Make voice input button more prominent on mobile */}
          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-2 rounded-full text-white ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
            } transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label="Voice input"
          >
            <FaMicrophone size={16} className={isListening ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          
          <button 
            type="submit"
            className={`text-white p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transform hover:scale-105 active:scale-95 ${
              inputValue.trim() 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

// Message skeleton component
const MessageSkeleton = ({ darkMode }) => (
  <div className={`flex justify-start animate-pulse`}>
    <div className={`max-w-[90%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl shadow-sm ${
      darkMode ? 'bg-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
          darkMode ? 'bg-gray-600' : 'bg-gray-200'
        }`}></div>
        <div className="flex-1">
          <div className={`h-2 ${
            darkMode ? 'bg-gray-600' : 'bg-gray-200'
          } rounded w-3/4 mb-2`}></div>
          <div className={`h-2 ${
            darkMode ? 'bg-gray-600' : 'bg-gray-200'
          } rounded w-1/2`}></div>
        </div>
      </div>
    </div>
  </div>
);