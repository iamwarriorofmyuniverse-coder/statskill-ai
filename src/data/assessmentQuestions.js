// StatSkill AI - Master 22-Question Competency Assessment Engine Dataset
// Covers: Survey Design, Sampling, Data Quality, Official Statistics, Python, SQL, Data Visualization, Data Privacy, Cybersecurity, Ethics, Communication
// Bilingual (English & Hindi) Rajbhasha Compliant

export const MASTER_ASSESSMENT_METADATA = {
  "id": "assess-master-2025",
  "title": "Official Statistical Cadre Competency Diagnostic (Comprehensive)",
  "domain": "Multi-Domain",
  "targetRole": "Statistical Officer",
  "totalQuestions": 22,
  "durationMinutes": 30,
  "passingScore": 75,
  "description": "Comprehensive 22-item standardized diagnostic evaluating statistical methodologies, data science tooling, digital governance compliance, and professional ethics for India's Official Statistical System."
};

export const MASTER_ASSESSMENT_QUESTIONS = [
  {
    "id": "q-sd-01",
    "question": "During the preparation of a national household survey schedule (e.g., Periodic Labour Force Survey), what is the primary technical objective of conducting a structured pilot survey before full field rollout?",
    "options": [
      "To obtain preliminary population census totals for statutory Gazette notification",
      "To test schedule wording, response burden, skip patterns, and interviewer comprehension under real field conditions",
      "To train state government administrative clerks in desk data entry protocols",
      "To determine the final national budget allocation without reviewing survey errors"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-stat-01",
    "competencyName": "Survey Design",
    "domain": "Statistical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "A pilot survey pre-tests survey instruments, assesses respondent burden, identifies ambiguous wording, validates skip sequencing, and measures interviewer administration times before embarking on nationwide data collection.",
    "questionHi": "राष्ट्रीय पारिवारिक सर्वेक्षण अनुसूची (जैसे आवधिक श्रम बल सर्वेक्षण - PLFS) तैयार करते समय, पूर्ण क्षेत्रीय क्रियान्वयन से पूर्व एक संरचित पायलट सर्वेक्षण करने का मुख्य तकनीकी उद्देश्य क्या है?",
    "optionsHi": [
      "सांविधिक राजपत्र अधिसूचना हेतु प्रारंभिक जनसंख्या जनगणना कुल योग प्राप्त करना",
      "वास्तविक क्षेत्रीय परिस्थितियों में अनुसूची की शब्दावली, उत्तरदाता पर भार, स्किप पैटर्न और प्रगणक की समझ का परीक्षण करना",
      "राज्य सरकार के प्रशासनिक कर्मचारियों को डेस्क डेटा प्रविष्टि प्रोटोकॉल में प्रशिक्षित करना",
      "सर्वेक्षण त्रुटियों की समीक्षा किए बिना अंतिम राष्ट्रीय बजट आवंटन निर्धारित करना"
    ],
    "explanationHi": "पायलट सर्वेक्षण से सर्वेक्षण उपकरणों का पूर्व-परीक्षण होता है, उत्तरदाता के भार का आकलन होता है और राष्ट्रव्यापी डेटा संग्रह से पहले कमियों को सुधारा जाता है।"
  },
  {
    "id": "q-sd-02",
    "question": "In questionnaire design for socio-economic surveys, why must 'double-barreled' questions (e.g., 'Did your household receive subsidised rations AND piped water last month?') be strictly avoided?",
    "options": [
      "They cause tablet CAPI software to consume excessive battery power",
      "They combine two distinct inquiry concepts into a single item, rendering response interpretation ambiguous",
      "They violate the Laspeyres price index standardisation requirements",
      "They can only be answered by literate respondents with secondary education"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-stat-01",
    "competencyName": "Survey Design",
    "domain": "Statistical",
    "difficulty": "Foundational",
    "weight": 1,
    "explanation": "Double-barreled questions ask two distinct things simultaneously with a single answer choice, making it impossible to ascertain whether the respondent agreed with the first part, the second part, or both.",
    "questionHi": "सामाजिक-आर्थिक सर्वेक्षणों के लिए प्रश्नावली प्रारूपण में 'दोहरे प्रश्नों' (जैसे 'क्या आपके परिवार को पिछले महीने रियायती राशन और नल का पानी दोनों मिले?') से सख्ती से क्यों बचना चाहिए?",
    "optionsHi": [
      "वे टैबलेट सीएपीआई (CAPI) सॉफ्टवेयर में अत्यधिक बैटरी की खपत करते हैं",
      "वे एक ही प्रश्न में दो अलग-अलग अवधारणाओं को मिला देते हैं, जिससे उत्तर की व्याख्या अस्पष्ट हो जाती है",
      "वे लास्पेयर मूल्य सूचकांक मानकीकरण आवश्यकताओं का उल्लंघन करते हैं",
      "उनका उत्तर केवल माध्यमिक शिक्षा प्राप्त साक्षर उत्तरदाता ही दे सकते हैं"
    ],
    "explanationHi": "दोहरे प्रश्न एक ही विकल्प के साथ दो अलग-अलग बातें पूछते हैं, जिससे यह जानना असंभव हो जाता है कि उत्तरदाता पहले भाग से सहमत था, दूसरे से या दोनों से।"
  },
  {
    "id": "q-samp-01",
    "question": "In a stratified multi-stage design for nationwide surveys, why are Primary Sampling Units (e.g., 2011 Census villages or Urban Frame Survey blocks) typically selected with Probability Proportional to Size without Replacement (PPSWOR)?",
    "options": [
      "To ensure equal workload allocation and yield an approximately self-weighting sample when a constant number of ultimate units is drawn per PSU",
      "To eliminate the requirement of collecting listing data during the second-stage sample frame preparation",
      "To guarantee that every village in the country has an identical 100% probability of inclusion",
      "To replace standard variance estimators with non-parametric bootstrapping"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-stat-02",
    "competencyName": "Sampling",
    "domain": "Statistical",
    "difficulty": "Advanced",
    "weight": 1,
    "explanation": "Selecting PSUs with Probability Proportional to Size (PPS) combined with selecting a fixed number of households per PSU produces a self-weighting design within strata, ensuring balanced enumerator workloads and simplifying estimation.",
    "questionHi": "राष्ट्रव्यापी सर्वेक्षणों हेतु स्तरीकृत बहु-स्तरीय प्रतिचयन में, प्राथमिक प्रतिचयन इकाइयों (PSUs) का चयन आकार के अनुपातिक प्रायिकता प्रतिस्थापन रहित (PPSWOR) विधि से क्यों किया जाता है?",
    "optionsHi": [
      "समान कार्यभार सुनिश्चित करने और लगभग स्व-भारित प्रतिदर्श प्राप्त करने हेतु",
      "द्वितीय स्तरीय प्रतिदर्श फ्रेम तैयार करने के दौरान लिस्टिंग डेटा एकत्र करने की आवश्यकता समाप्त करने हेतु",
      "यह सुनिश्चित करने के लिए कि देश के प्रत्येक गाँव की चयन प्रायिकता शत-प्रतिशत समान हो",
      "मानक प्रसरण अनुमानकों को गैर-पैरामीट्रिक बूटस्ट्रैपिंग से बदलने हेतु"
    ],
    "explanationHi": "PPSWOR चयन से बड़े PSUs को उचित प्रतिनिधित्व मिलता है और अंतिम इकाइयों का प्रतिदर्श लगभग स्व-भारित बनता है।"
  },
  {
    "id": "q-samp-02",
    "question": "When calculating sampling weights (multipliers) in a two-stage stratified survey where PSUs are chosen with probability P1 and households within chosen PSUs are chosen with probability P2, what is the design base weight (unadjusted for non-response)?",
    "options": [
      "The product of the probabilities: P1 * P2",
      "The reciprocal of the joint inclusion probability: 1 / (P1 * P2)",
      "The difference of inclusion probabilities: 1 - (P1 * P2)",
      "The ratio of the total population to the sample size: N / n without stratum conditioning"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-stat-02",
    "competencyName": "Sampling",
    "domain": "Statistical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "The design weight (Horvitz-Thompson weight) is the inverse of the unit's overall inclusion probability: w = 1 / p, where p = P1 * P2.",
    "questionHi": "शहरी फ्रेम सर्वेक्षण (UFS) में उप-विभाजित गैर-समान ब्लॉक आकारों से निपटने हेतु आधिकारिक सांख्यिकी में किस प्रतिचयन प्रविधि की अनुशंसा की जाती है?",
    "optionsHi": [
      "ब्लॉकों को उप-ब्लॉकों में विभाजित कर यादृच्छिक रूप से एक उप-ब्लॉक का चयन करना",
      "सूची से सभी बड़े शहरी ब्लॉकों को स्थायी रूप से हटा देना",
      "केवल सरकारी कर्मचारियों के आवासीय परिसरों का सर्वेक्षण करना",
      "प्रतिचयन को छोड़कर केवल स्वेच्छा से भाग लेने वालों का डेटा लेना"
    ],
    "explanationHi": "बड़े शहरी फ्रेम ब्लॉकों को उप-ब्लॉकों में विभाजित किया जाता है ताकि कार्यभार संतुलित रहे और प्रतिचयन पूर्वाग्रह न आए।"
  },
  {
    "id": "q-dq-01",
    "question": "Which of the following errors in an official statistical survey is classified as a NON-SAMPLING error rather than a sampling error?",
    "options": [
      "Variation in estimates caused by observing a sample rather than the complete census population",
      "Inaccuracy due to respondent recall decay, ambiguous question phrasing, or interviewer measurement bias",
      "Decrease in margin of error resulting from doubling the number of sampled enumeration blocks",
      "Statistical variance in Horvitz-Thompson estimators under stratified PPS sampling"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-stat-03",
    "competencyName": "Data Quality",
    "domain": "Statistical",
    "difficulty": "Foundational",
    "weight": 1,
    "explanation": "Non-sampling errors arise from measurement instrument flaws, respondent misreporting, interviewer bias, coverage defects, and data entry errors, occurring in both sample surveys and complete censuses.",
    "questionHi": "कंप्यूटर-सहायता प्राप्त व्यक्तिगत साक्षात्कार (CAPI) में डेटा प्रविष्टि के दौरान अमान्य मानों को रोकने के लिए सबसे प्रभावी डेटा गुणवत्ता जांच कौन सी है?",
    "optionsHi": [
      "वास्तविक समय सीमा एवं तर्कसंगत संगति सत्यापन (Range & Logical Consistency Checks)",
      "डेटा संग्रह पूर्ण होने के 6 महीने बाद मैनुअल स्प्रेडशीट सत्यापन",
      "सर्वेक्षण के बाद सभी विसंगतियों को स्वतः औसत मान से बदल देना",
      "प्रगणकों को केवल अनुमानित संख्याओं को दर्ज करने का निर्देश देना"
    ],
    "explanationHi": "CAPI में रियल-टाइम रेंज और लॉजिक वैलिडेशन से क्षेत्रीय स्तर पर ही गलत प्रविष्टियों को तुरंत रोका जा सकता है।"
  },
  {
    "id": "q-dq-02",
    "question": "In the validation pipeline for the Annual Survey of Industries (ASI), a schedule reports: Gross Output = 0, but Total Fuel Consumed = ?18,00,000 and Wages Paid = ?24,00,000. Which automated validation rule should be triggered?",
    "options": [
      "Range Check warning only",
      "Relational / Logical Consistency Check failure requiring field verification or re-audit",
      "Automatic deletion of the enterprise record from the national sampling frame",
      "Substitution of the enterprise with an adjacent factory schedule"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-stat-03",
    "competencyName": "Data Quality",
    "domain": "Statistical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "A relational consistency check evaluates logical relationships across multiple schedule blocks. Incurring substantial fuel and wage costs while reporting zero output indicates either operational suspension, incomplete production reporting, or transcription error.",
    "questionHi": "आधिकारिक सर्वेक्षण माइक्रोडाटा में आउटलायर्स (अत्यधिक चरम मान) की पहचान एवं प्रबंधन हेतु MoSPI द्वारा अनुशंसित सर्वोत्तम दृष्टिकोण क्या है?",
    "optionsHi": [
      "विंसराइजेशन या तर्कसंगत सत्यापन के माध्यम से जांच करना और मूल प्रविष्टि का कारण प्रलेखित करना",
      "बिना जांच किए उच्चतम 10% डेटा को सीधे डेटाबेस से हटा देना",
      "सभी आउटलायर्स को शून्य में बदल देना",
      "रिपोर्टिंग समय कम करने के लिए आउटलायर्स की अनदेखी करना"
    ],
    "explanationHi": "आउटलायर्स को बिना सत्यापन के नहीं हटाना चाहिए; उनकी तर्कसंगत पुष्टि और मानक विधियों से प्रबंधन आवश्यक है।"
  },
  {
    "id": "q-os-01",
    "question": "In India's official Consumer Price Index (CPI) compilation by the National Statistics Office (NSO), which index formula is predominantly employed to aggregate item price relatives at the elementary and sub-group levels?",
    "options": [
      "Modified Laspeyres Index formula with fixed base-period consumption expenditure weights",
      "Paasche Index formula requiring monthly updated household budget surveys",
      "Fisher's Ideal Index requiring real-time current period quantity weights",
      "Unweighted Simple Arithmetic Average of raw retail prices"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-stat-04",
    "competencyName": "Official Statistics",
    "domain": "Statistical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "The official CPI uses a modified Laspeyres formula with fixed base-year expenditure weights derived from Consumer Expenditure Survey rounds, as current-period quantity weights (Paasche) are unavailable on a monthly basis.",
    "questionHi": "भारत में आवधिक श्रम बल सर्वेक्षण (PLFS) और उपभोक्ता व्यय सर्वेक्षण (CES) के संचालन के लिए कौन सा राष्ट्रीय संगठन मुख्य रूप से उत्तरदायी है?",
    "optionsHi": [
      "राष्ट्रीय प्रतिदर्श सर्वेक्षण कार्यालय (NSSO), MoSPI",
      "भारतीय रिजर्व बैंक (RBI)",
      "नीति आयोग (NITI Aayog)",
      "भारतीय दूरसंचार विनियामक प्राधिकरण (TRAI)"
    ],
    "explanationHi": "NSSO भारत में राष्ट्रव्यापी सामाजिक-आर्थिक सर्वेक्षणों जैसे PLFS और CES के संचालन हेतु नोडल संस्था है।"
  },
  {
    "id": "q-os-02",
    "question": "Under the UN System of National Accounts (SNA 2008) and India's National Accounts methodology, what is the precise relationship between Gross Value Added (GVA) at basic prices and Gross Domestic Product (GDP) at market prices?",
    "options": [
      "GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies",
      "GDP at market prices = GVA at basic prices - Product Taxes + Product Subsidies",
      "GDP at market prices = GVA at factor cost + Net Factor Income from Abroad",
      "GDP at market prices = GVA at basic prices divided by the GDP Deflator"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-stat-04",
    "competencyName": "Official Statistics",
    "domain": "Statistical",
    "difficulty": "Advanced",
    "weight": 1,
    "explanation": "Under SNA 2008: GDP at market prices = GVA at basic prices + (Taxes on Products - Subsidies on Products). This standardizes headline national income reporting across international statistical bodies.",
    "questionHi": "औद्योगिक उत्पादन सूचकांक (IIP) और वार्षिक उद्योग सर्वेक्षण (ASI) के बीच मूलभूत अंतर क्या है?",
    "optionsHi": [
      "IIP अल्पकालिक मासिक उत्पादन रुझान मापता है जबकि ASI विस्तृत वार्षिक वित्तीय व परिचालन लेखा परीक्षा प्रदान करता है",
      "IIP केवल कृषि उत्पादन मापता है जबकि ASI केवल सेवा क्षेत्र को मापता है",
      "ASI केवल 10 से कम कर्मचारियों वाली अनौपचारिक इकाइयों का सर्वेक्षण करता है",
      "दोनों में कोई अंतर नहीं है, दोनों समान आवधिकता पर प्रकाशित होते हैं"
    ],
    "explanationHi": "IIP एक मासिक त्वरित सूचकांक है, जबकि ASI पंजीकृत विनिर्माण क्षेत्र का व्यापक वार्षिक लेखा-परीक्षित सर्वेक्षण है।"
  },
  {
    "id": "q-py-01",
    "question": "When aggregating weighted averages across 10 million rows of survey microdata in Python using pandas, why should you use vectorized operations (e.g., `np.average(df['income'], weights=df['weight'])`) instead of `for index, row in df.iterrows():`?",
    "options": [
      "Vectorization runs compiled C-level loops and SIMD instructions, executing 100x-500x faster than Python interpreter overhead in `iterrows()`",
      "`iterrows()` automatically truncates floating-point numbers to two decimal places",
      "Python standard library prohibits iterating over pandas DataFrames in multi-threaded environments",
      "`np.average` automatically imputes missing values using k-nearest neighbors"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-tech-01",
    "competencyName": "Python",
    "domain": "Technical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "Pandas and NumPy vectorization delegates element-wise computations to optimized C routines and SIMD CPU vector registers, avoiding boxing/unboxing overhead and Python interpreter loop penalties.",
    "questionHi": "पायथन (Pandas) में बड़े राष्ट्रीय सर्वेक्षण माइक्रोडाटासेट (जैसे PLFS) से प्रतिदर्श भार लागू करके कुल जनसंख्या अनुमान की गणना हेतु कौन सा तरीका सही है?",
    "optionsHi": [
      "(df['variable'] * df['weight']).sum() / df['weight'].sum() भारित औसत हेतु",
      "बिना भार के सीधे df['variable'].mean() लेना",
      "डेटाफ्रेम के सभी मानों को स्ट्रिंग में बदलना",
      "सभी वेट्स को 1 से बदल देना"
    ],
    "explanationHi": "सर्वेक्षण डेटा में जनसंख्या अनुमान हेतु भारित योग को कुल भार से विभाजित करना अनिवार्य होता है।"
  },
  {
    "id": "q-py-02",
    "question": "In Python pandas, which statement correctly replaces NaN values in the 'monthly_consumption' column with the median consumption of the corresponding 'state_code' stratum?",
    "options": [
      "df['monthly_consumption'] = df.groupby('state_code')['monthly_consumption'].transform(lambda x: x.fillna(x.median()))",
      "df['monthly_consumption'] = df['monthly_consumption'].replace(0, df.median())",
      "df['monthly_consumption'] = df.dropna(subset=['monthly_consumption'])",
      "df['monthly_consumption'] = np.where(df['monthly_consumption'].isna(), 'median', df['monthly_consumption'])"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-tech-01",
    "competencyName": "Python",
    "domain": "Technical",
    "difficulty": "Advanced",
    "weight": 1,
    "explanation": "`df.groupby('state_code')['monthly_consumption'].transform(lambda x: x.fillna(x.median()))` computes group-specific medians and aligns them back with the original DataFrame index, preserving stratum fidelity during imputation.",
    "questionHi": "Pandas में डेटासेट के गुम (Missing/NaN) मानों की पहचान और गणना के लिए सबसे उपयुक्त कमांड कौन सी है?",
    "optionsHi": [
      "df.isnull().sum() या df.isna().sum()",
      "df.drop_duplicates()",
      "df.sort_values(ascending=True)",
      "df.to_csv('output.csv')"
    ],
    "explanationHi": "df.isnull().sum() प्रत्येक कॉलम में लुप्त मानों की सटीक संख्या प्रदान करता है।"
  },
  {
    "id": "q-sql-01",
    "question": "In an administrative census database, which SQL query ranks districts within each state by their total recorded population in descending order, assigning rank 1 to the highest population district in every state?",
    "options": [
      "SELECT state_code, district_name, population, RANK() OVER (PARTITION BY state_code ORDER BY population DESC) as district_rank FROM census_districts;",
      "SELECT state_code, district_name, population, ORDER BY population DESC GROUP BY state_code;",
      "SELECT state_code, district_name, population, ROW_NUMBER() OVER (ORDER BY state_code, population) as district_rank FROM census_districts;",
      "SELECT state_code, district_name, MAX(population) OVER (PARTITION BY district_name) FROM census_districts;"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-tech-02",
    "competencyName": "SQL",
    "domain": "Technical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "The window function `RANK() OVER (PARTITION BY state_code ORDER BY population DESC)` resets the ranking within each `state_code` partition and ranks districts by population descending.",
    "questionHi": "एसक्यूएल (SQL) में दो सर्वेक्षण तालिकाओं (परिवार स्तर एवं सदस्य स्तर) को परिवार आईडी (household_id) के आधार पर जोड़ने हेतु कौन सा क्लॉज उपयोग किया जाता है?",
    "optionsHi": [
      "INNER JOIN / LEFT JOIN ... ON household.id = member.household_id",
      "GROUP BY household.id HAVING count(*) > 1",
      "ORDER BY member.household_id DESC",
      "DROP TABLE household"
    ],
    "explanationHi": "JOIN क्लॉज प्राथमिक और विदेशी कुंजी (Household ID) के आधार पर बहु-स्तरीय सर्वेक्षण तालिकाओं को जोड़ता है।"
  },
  {
    "id": "q-sql-02",
    "question": "When joining a 50-million-row Enterprise Registry table with a 500-million-row Monthly GST Transaction table in PostgreSQL, what database optimization is critical to prevent slow sequential table scans?",
    "options": [
      "Creating B-tree or hash indexes on the foreign key join column (e.g., `enterprise_pan_id`) on both tables",
      "Converting all integer primary keys into alphanumeric VARCHAR strings",
      "Using `SELECT *` without column projection or WHERE clause filtering",
      "Disabling the PostgreSQL query planner cache before every query execution"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-tech-02",
    "competencyName": "SQL",
    "domain": "Technical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "Indexing foreign key columns enables the query planner to perform fast Index Scans or Hash Joins instead of full sequential table scans over hundreds of millions of records.",
    "questionHi": "SQL में प्रत्येक राज्यवार कुल उत्तरदाताओं की संख्या और औसत मासिक उपभोग व्यय ज्ञात करने हेतु किस क्लॉज का प्रयोग आवश्यक है?",
    "optionsHi": [
      "GROUP BY state_code",
      "WHERE state_code IS NULL",
      "LIMIT 1",
      "DISTINCT state_code"
    ],
    "explanationHi": "GROUP BY क्लॉज समुच्चय फलनों (COUNT, AVG) के साथ समूहवार गणना करने हेतु अनिवार्य है।"
  },
  {
    "id": "q-viz-01",
    "question": "You need to display the regional distribution of the Infant Mortality Rate (IMR) across all 780+ districts of India in an official MoSPI dashboard. Which visual representation is most technically appropriate?",
    "options": [
      "A pie chart with 780 colored slices",
      "A choropleth thematic map using standardized classification bins (e.g., Natural Breaks or Quantiles) with a perceptually uniform color ramp",
      "A 3D perspective bar chart with tilted rotating cylinders",
      "A radar chart connecting all 780 district points on a single polar axis"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-tech-03",
    "competencyName": "Data Visualization",
    "domain": "Technical",
    "difficulty": "Foundational",
    "weight": 1,
    "explanation": "Choropleth thematic maps represent continuous spatial rates across geographic boundaries using classified color ramps, enabling policymakers to spot geographic clusters and regional disparities immediately.",
    "questionHi": "विभिन्न राज्यों के बीच साक्षरता दर और कार्यबल सहभागिता दर के संबंध एवं सहसंबंध को दर्शाने हेतु कौन सा चार्ट सर्वोत्तम है?",
    "optionsHi": [
      "स्कैटर प्लॉट (Scatter Plot) या बबल चार्ट",
      "पाई चार्ट (Pie Chart)",
      "साधारण एकल लाइन चार्ट",
      "गैंट चार्ट (Gantt Chart)"
    ],
    "explanationHi": "स्कैटर प्लॉट दो निरंतर चरों के बीच संबंध, क्लस्टरिंग और सहसंबंध को स्पष्ट रूप से दर्शाता है।"
  },
  {
    "id": "q-viz-02",
    "question": "Why is truncating the baseline (y-axis not starting at zero) in a column/bar chart comparing state-wise literacy rates considered a violation of official statistical reporting integrity?",
    "options": [
      "It prevents the graphics rendering engine from anti-aliasing the chart text",
      "It visually exaggerates minute differences between states by distorting the relative length ratio of the bars",
      "It causes printing presses to consume excessive black ink in Gazette publications",
      "It prevents screen reader accessibility software from parsing the SVG DOM"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-tech-03",
    "competencyName": "Data Visualization",
    "domain": "Technical",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "In bar charts, the visual length of the bar encodes the numerical magnitude. Truncating the y-axis destroys the proportional visual mapping, artificially magnifying trivial differences and misleading the public.",
    "questionHi": "समय श्रृंखला आधारित मासिक मुद्रास्फीति (CPI) के पिछले 5 वर्षों के उतार-चढ़ाव को प्रस्तुत करने हेतु सबसे प्रभावी विज़ुअलाइज़ेशन कौन सा है?",
    "optionsHi": [
      "समय अक्ष के साथ बहु-रेखीय चार्ट (Multi-line Time-series Chart)",
      "3D पाई चार्ट",
      "राडार चार्ट",
      "ट्रीमैप (Treemap)"
    ],
    "explanationHi": "समय श्रृंखला रेखा चार्ट समय के साथ प्रवृत्तियों और मौसमी बदलावों को देखने हेतु सबसे मानक है।"
  },
  {
    "id": "q-dp-01",
    "question": "Under the Digital Personal Data Protection (DPDP) Act 2023 and official statistical data release guidelines, what must be performed before releasing public-use survey microdata containing household demographic records?",
    "options": [
      "Removing direct identifiers (e.g. name, Aadhaar, phone) AND applying statistical disclosure control (e.g. k-anonymity, top-coding, cell suppression) to quasi-identifiers",
      "Encrypting the file with a single national password published in major newspapers",
      "Obtaining written physical affidavits from every sampled respondent within 30 days of dataset publication",
      "Publishing raw identifying microdata provided researchers sign an informal email agreement"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-gov-01",
    "competencyName": "Data Privacy",
    "domain": "Digital Governance",
    "difficulty": "Advanced",
    "weight": 1,
    "explanation": "Effective de-identification requires stripping direct identifiers and addressing quasi-identifiers (such as age, gender, geographic ward, occupation) through k-anonymity, top-coding extreme values, and cell suppression to prevent linkage re-identification attacks.",
    "questionHi": "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 (DPDP Act 2023) के अंतर्गत आधिकारिक सर्वेक्षणों में उत्तरदाता की गोपनीयता की रक्षा हेतु क्या आवश्यक है?",
    "optionsHi": [
      "माइक्रोडाटा सार्वजनिक करने से पूर्व व्यक्तिगत पहचान योग्य जानकारी (PII) का पूर्ण अनामीकरण (Anonymization)",
      "उत्तरदाता का फोन नंबर और पता सार्वजनिक पोर्टल पर प्रकाशित करना",
      "डेटा को बिना एन्क्रिप्शन के ओपन सर्वर पर रखना",
      "उत्तरदाता की सहमति के बिना वाणिज्यिक कंपनियों को डेटा बेचना"
    ],
    "explanationHi": "DPDP Act 2023 के तहत आधिकारिक सांख्यिकी में व्यक्तिगत पहचान को हटाना और अनामीकृत करना वैधानिक अनिवार्यता है।"
  },
  {
    "id": "q-dp-02",
    "question": "What is a 'linkage attack' in the context of official survey microdata dissemination?",
    "options": [
      "A network distributed denial-of-service attack on government web servers",
      "Re-identifying anonymized individuals by matching quasi-identifiers (e.g., birthdate, postal code, gender) in survey data with publicly available auxiliary databases (e.g. voter lists)",
      "Connecting two relational database tables using an invalid primary key constraint",
      "Hyperlinking official PDF statistical bulletins to external commercial websites"
    ],
    "correctAnswer": 1,
    "competencyId": "comp-gov-01",
    "competencyName": "Data Privacy",
    "domain": "Digital Governance",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "A linkage attack occurs when an adversary combines de-identified microdata with auxiliary public datasets (such as electoral rolls or property records) that share overlapping quasi-identifiers, unmasking the identity of respondents.",
    "questionHi": "माइक्रोडाटा में 'के-एनोनिमिटी' (k-Anonymity) और डिफरेंशियल प्राइवेसी का मुख्य उद्देश्य क्या है?",
    "optionsHi": [
      "यह सुनिश्चित करना कि किसी भी व्यक्ति की पहचान सर्वेक्षण तालिका में कम से कम k व्यक्तियों के समूह में अप्रभेद्य रहे",
      "डेटाबेस के आकार को दोगुना करना",
      "सर्वेक्षण के सभी सांख्यिकीय तालिकाओं को हटाना",
      "केवल विदेशी नागरिकों के डेटा को सुरक्षित करना"
    ],
    "explanationHi": "k-Anonymity सुनिश्चित करती है कि किसी भी रिकॉर्ड को अर्ध-पहचानकर्ताओं द्वारा व्यक्तिगत रूप से अलग न किया जा सके।"
  },
  {
    "id": "q-cs-01",
    "question": "In Computer Assisted Personal Interviewing (CAPI) operations where field enumerator tablets transmit household survey schedules to central MoSPI servers, which security protocol is required by CERT-In guidelines to protect microdata in transit?",
    "options": [
      "Transport Layer Security (TLS 1.3) with strong cipher suites and mutual certificate pinning",
      "Unencrypted HTTP connections to conserve field device battery and cellular bandwidth",
      "Base64 string encoding transmitted over plain unauthenticated FTP",
      "SMS message forwarding of survey records to state headquarters"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-gov-02",
    "competencyName": "Cybersecurity",
    "domain": "Digital Governance",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "CERT-In and government guidelines mandate modern cryptographic protocols (TLS 1.3) with authenticated endpoints to protect sensitive survey schedules against interception, tampering, and man-in-the-middle attacks.",
    "questionHi": "आधिकारिक सांख्यिकी पोर्टल और डेटाबेस को साइबर हमलों से सुरक्षित रखने हेतु CERT-In के दिशा-निर्देशों के अनुसार कौन सा उपाय अनिवार्य है?",
    "optionsHi": [
      "बहु-कारक प्रमाणीकरण (MFA), डेटा एन्क्रिप्शन और नियमित सुरक्षा ऑडिट",
      "सभी प्रशासनिक खातों के लिए डिफ़ॉल्ट पासवर्ड 'admin123' रखना",
      "सुरक्षा पैच को कभी अपडेट न करना",
      "डेटाबेस को सार्वजनिक इंटरनेट पर बिना पासवर्ड के खोलना"
    ],
    "explanationHi": "CERT-In मानकों के अनुसार MFA, डेटा-एट-रेस्ट एन्क्रिप्शन और समयबद्ध वल्नेरेबिलिटी असेसमेंट अनिवार्य सुरक्षा प्रोटोकॉल हैं।"
  },
  {
    "id": "q-cs-02",
    "question": "Which access control paradigm should be implemented on central statistical data servers to ensure statistical officers can only inspect and edit microdata from their assigned regional jurisdictions?",
    "options": [
      "Role-Based Access Control (RBAC) combined with Attribute-Based Access Control (ABAC) adhering to the Principle of Least Privilege",
      "Universal administrative root privileges shared across all division employees",
      "Open read-write permissions across local area network shared folders",
      "Periodic password changes while retaining universal database superuser accounts"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-gov-02",
    "competencyName": "Cybersecurity",
    "domain": "Digital Governance",
    "difficulty": "Foundational",
    "weight": 1,
    "explanation": "Role-Based and Attribute-Based Access Control (RBAC/ABAC) ensures statistical staff access only the data tiers and regional partitions necessary for their official duties, minimizing data breach exposure.",
    "questionHi": "यदि किसी क्षेत्रीय प्रगणक का CAPI टैबलेट खो जाता है, तो तात्कालिक साइबर सुरक्षा प्रोटोकॉल क्या होना चाहिए?",
    "optionsHi": [
      "नोडल सुरक्षा अधिकारी को तत्काल रिपोर्ट करना और डिवाइस को रिमोट वाइप (Remote Wipe) कर सत्र रद्द करना",
      "घटना को 30 दिनों तक गुप्त रखना",
      "टैबलेट का पासवर्ड सोशल मीडिया पर साझा करना",
      "खोए हुए टैबलेट को अनदेखा कर नया टैबलेट बिना सुरक्षा सेटिंग्स के ले लेना"
    ],
    "explanationHi": "डिवाइस खोने पर तत्काल रिमोट डेटा वाइप और सत्र निरस्तीकरण अनधिकृत डेटा पहुंच को रोकने हेतु प्राथमिक प्रोटोकॉल है।"
  },
  {
    "id": "q-eth-01",
    "question": "According to Principle 2 (Professionalism and Ethics) of the UN Fundamental Principles of Official Statistics, on what basis must official statistical agencies decide on methods, procedures, and data dissemination formats?",
    "options": [
      "Strictly on professional considerations, scientific principles, and international statistical best practices, entirely independent of political pressure",
      "On political party campaign directives to maximize positive publicity for governing administrations",
      "On commercial advertising sponsorship from private data analytics vendors",
      "On informal verbal instructions from municipal public relations consultants"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-mgt-03",
    "competencyName": "Ethics",
    "domain": "Behavioural & Managerial",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "The UN Fundamental Principles mandate that official statistical agencies maintain strict professional independence, selecting methodology, sampling frames, and release calendars objectively and scientifically.",
    "questionHi": "संयुक्त राष्ट्र के आधिकारिक सांख्यिकी के मूलभूत सिद्धांतों के अनुसार सांख्यिकी अधिकारियों का प्रमुख दायित्व क्या है?",
    "optionsHi": [
      "वैज्ञानिक सिद्धांतों, पेशेवर नैतिकता और सख्त निष्पक्षता के आधार पर निष्पक्ष डेटा प्रस्तुत करना",
      "राजनीतिक प्राथमिकताओं के अनुसार सर्वेक्षण परिणामों में हेरफेर करना",
      "अनुकूल न दिखने वाले आंकड़ों को छुपा देना",
      "केवल सकारात्मक आर्थिक संकेतकों को प्रकाशित करना"
    ],
    "explanationHi": "आधिकारिक सांख्यिकी की साख निष्पक्षता, वैज्ञानिक मानकों और जनता के विश्वास पर टिकी है।"
  },
  {
    "id": "q-eth-02",
    "question": "A senior ministry official informally requests an advance draft of upcoming Consumer Price Index (CPI) numbers 48 hours before official scheduled release, hinting at suppressing an uptick in food inflation. What is the ethical and statutory obligation of the Statistical Officer?",
    "options": [
      "Strictly uphold the pre-announced statistical release calendar and embargo protocols, preserving equal access and statistical integrity",
      "Immediately alter the survey weights in the software to show lower inflation numbers",
      "Leak the numbers to select financial market traders prior to the release",
      "Delete the raw price schedules from the database to delay publication indefinitely"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-mgt-03",
    "competencyName": "Ethics",
    "domain": "Behavioural & Managerial",
    "difficulty": "Foundational",
    "weight": 1,
    "explanation": "Official statistical integrity demands adherence to pre-announced release calendars and strict embargo rules. Early leakage or selective modification of preliminary market-sensitive data violates statutory ethics and public trust.",
    "questionHi": "यदि कोई उच्चाधिकारी आधिकारिक रिलीज से पूर्व सीपीआई मुद्रास्फीति के आंकड़ों में बदलाव करने का अनौपचारिक दबाव बनाता है, तो सांख्यिकी अधिकारी का क्या कर्तव्य है?",
    "optionsHi": [
      "पूर्व-घोषित रिलीज कैलेंडर और नैतिक शुचिता का पालन करते हुए निष्पक्ष आंकड़ों पर अडिग रहना",
      "सॉफ्टवेयर में वेट्स बदलकर कम मुद्रास्फीति दिखाना",
      "आंकड़ों को रिलीज से पहले चुनिंदा व्यापारियों को लीक करना",
      "डेटाबेस से फाइलें डिलीट कर देना"
    ],
    "explanationHi": "सांख्यिकी अधिकारी का वैधानिक एवं नैतिक कर्तव्य आधिकारिक रिलीज कैलेंडर और निष्पक्षता की रक्षा करना है।"
  },
  {
    "id": "q-comm-01",
    "question": "When drafting an official statistical policy brief for administrative ministries explaining an increase in quarterly unemployment from 4.2% to 4.5% with a 95% margin of error of �0.4%, how should the finding be accurately communicated?",
    "options": [
      "State that the observed difference is within the survey's margin of error and does not represent a statistically significant change at the 95% confidence level",
      "Declare an unprecedented nationwide employment crisis requiring immediate statutory intervention",
      "Omit the margin of error and confidence interval from the brief because administrators dislike technical nuances",
      "Claim that unemployment has definitely decreased due to rounding conventions"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-mgt-01",
    "competencyName": "Communication",
    "domain": "Behavioural & Managerial",
    "difficulty": "Intermediate",
    "weight": 1,
    "explanation": "Statistical communication requires transparently explaining uncertainty. Because the 0.3% change falls well within the �0.4% margin of error, asserting a definitive shift would be scientifically misleading.",
    "questionHi": "प्रशासनिक मंत्रालयों हेतु सांख्यिकीय पॉलिसी ब्रीफ तैयार करते समय, यदि बेरोजगारी में 4.2% से 4.5% की वृद्धि 95% विश्वास स्तर पर ±0.4% त्रुटि सीमा के भीतर है, तो सही निष्कर्ष क्या होगा?",
    "optionsHi": [
      "यह अंतर सर्वेक्षण त्रुटि सीमा के भीतर है और 95% विश्वास स्तर पर सांख्यिकीय रूप से महत्वपूर्ण बदलाव नहीं दर्शाता",
      "देशव्यापी संकट की घोषणा करना",
      "त्रुटि सीमा का उल्लेख ही न करना",
      "यह दावा करना कि बेरोजगारी निश्चित रूप से घटी है"
    ],
    "explanationHi": "सांख्यिकीय संप्रेषण में त्रुटि सीमा और अनिश्चितता को स्पष्ट रूप से समझाना आवश्यक है।"
  },
  {
    "id": "q-comm-02",
    "question": "Which component is essential in official statistical press notes accompanying headline macroeconomic releases (such as GDP, IIP, or CPI)?",
    "options": [
      "Comprehensive metadata notes documenting data sources, response rates, base periods, revision policies, and methodological caveats",
      "Speculative investment forecasts and commercial stock trading recommendations",
      "Anonymous political commentary on global geopolitical elections",
      "Photographs of local administrative field vehicles without statistical tables"
    ],
    "correctAnswer": 0,
    "competencyId": "comp-mgt-01",
    "competencyName": "Communication",
    "domain": "Behavioural & Managerial",
    "difficulty": "Foundational",
    "weight": 1,
    "explanation": "Official statistical releases must include explicit metadata detailing data sources, scope, response rates, base-year revisions, and caveats to ensure data users interpret numbers accurately.",
    "questionHi": "आधिकारिक सांख्यिकीय प्रेस विज्ञप्ति (जैसे GDP या CPI) के साथ कौन सा घटक संलग्न होना अनिवार्य है?",
    "optionsHi": [
      "डेटा स्रोत, प्रतिक्रिया दर, आधार वर्ष और कार्यप्रणाली विवरण से युक्त व्यापक मेटाडेटा",
      "शेयर बाजार की सट्टेबाजी संबंधी सिफारिशें",
      "वैश्विक चुनावों पर राजनीतिक टिप्पणियां",
      "बिना तालिकाओं के केवल वाहनों की तस्वीरें"
    ],
    "explanationHi": "आधिकारिक आंकड़ों की सही व्याख्या हेतु मेटाडेटा, आधार वर्ष और कार्यप्रणाली का स्पष्ट विवरण आवश्यक है।"
  }
];
