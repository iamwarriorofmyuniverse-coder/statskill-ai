// StatSkill AI - Master 22-Question Competency Assessment Engine Dataset
// Covers: Survey Design, Sampling, Data Quality, Official Statistics, Python, SQL, Data Visualization, Data Privacy, Cybersecurity, Ethics, Communication

export const MASTER_ASSESSMENT_METADATA = {
  id: "assess-master-2025",
  title: "Official Statistical Cadre Competency Diagnostic (Comprehensive)",
  domain: "Multi-Domain",
  targetRole: "Statistical Officer",
  totalQuestions: 22,
  durationMinutes: 30,
  passingScore: 75,
  description: "Comprehensive 22-item standardized diagnostic evaluating statistical methodologies, data science tooling, digital governance compliance, and professional ethics for India's Official Statistical System."
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
    "explanation": "A pilot survey pre-tests survey instruments, assesses respondent burden, identifies ambiguous wording, validates skip sequencing, and measures interviewer administration times before embarking on nationwide data collection."
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
    "explanation": "Double-barreled questions ask two distinct things simultaneously with a single answer choice, making it impossible to ascertain whether the respondent agreed with the first part, the second part, or both."
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
    "explanation": "Selecting PSUs with Probability Proportional to Size (PPS) combined with selecting a fixed number of households per PSU produces a self-weighting design within strata, ensuring balanced enumerator workloads and simplifying estimation."
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
    "explanation": "The design weight (Horvitz-Thompson weight) is the inverse of the unit's overall inclusion probability: w = 1 / p, where p = P1 * P2."
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
    "explanation": "Non-sampling errors arise from measurement instrument flaws, respondent misreporting, interviewer bias, coverage defects, and data entry errors, occurring in both sample surveys and complete censuses."
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
    "explanation": "A relational consistency check evaluates logical relationships across multiple schedule blocks. Incurring substantial fuel and wage costs while reporting zero output indicates either operational suspension, incomplete production reporting, or transcription error."
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
    "explanation": "The official CPI uses a modified Laspeyres formula with fixed base-year expenditure weights derived from Consumer Expenditure Survey rounds, as current-period quantity weights (Paasche) are unavailable on a monthly basis."
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
    "explanation": "Under SNA 2008: GDP at market prices = GVA at basic prices + (Taxes on Products - Subsidies on Products). This standardizes headline national income reporting across international statistical bodies."
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
    "explanation": "Pandas and NumPy vectorization delegates element-wise computations to optimized C routines and SIMD CPU vector registers, avoiding boxing/unboxing overhead and Python interpreter loop penalties."
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
    "explanation": "`df.groupby('state_code')['monthly_consumption'].transform(lambda x: x.fillna(x.median()))` computes group-specific medians and aligns them back with the original DataFrame index, preserving stratum fidelity during imputation."
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
    "explanation": "The window function `RANK() OVER (PARTITION BY state_code ORDER BY population DESC)` resets the ranking within each `state_code` partition and ranks districts by population descending."
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
    "explanation": "Indexing foreign key columns enables the query planner to perform fast Index Scans or Hash Joins instead of full sequential table scans over hundreds of millions of records."
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
    "explanation": "Choropleth thematic maps represent continuous spatial rates across geographic boundaries using classified color ramps, enabling policymakers to spot geographic clusters and regional disparities immediately."
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
    "explanation": "In bar charts, the visual length of the bar encodes the numerical magnitude. Truncating the y-axis destroys the proportional visual mapping, artificially magnifying trivial differences and misleading the public."
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
    "explanation": "Effective de-identification requires stripping direct identifiers and addressing quasi-identifiers (such as age, gender, geographic ward, occupation) through k-anonymity, top-coding extreme values, and cell suppression to prevent linkage re-identification attacks."
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
    "explanation": "A linkage attack occurs when an adversary combines de-identified microdata with auxiliary public datasets (such as electoral rolls or property records) that share overlapping quasi-identifiers, unmasking the identity of respondents."
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
    "explanation": "CERT-In and government guidelines mandate modern cryptographic protocols (TLS 1.3) with authenticated endpoints to protect sensitive survey schedules against interception, tampering, and man-in-the-middle attacks."
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
    "explanation": "Role-Based and Attribute-Based Access Control (RBAC/ABAC) ensures statistical staff access only the data tiers and regional partitions necessary for their official duties, minimizing data breach exposure."
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
    "explanation": "The UN Fundamental Principles mandate that official statistical agencies maintain strict professional independence, selecting methodology, sampling frames, and release calendars objectively and scientifically."
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
    "explanation": "Official statistical integrity demands adherence to pre-announced release calendars and strict embargo rules. Early leakage or selective modification of preliminary market-sensitive data violates statutory ethics and public trust."
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
    "explanation": "Statistical communication requires transparently explaining uncertainty. Because the 0.3% change falls well within the �0.4% margin of error, asserting a definitive shift would be scientifically misleading."
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
    "explanation": "Official statistical releases must include explicit metadata detailing data sources, scope, response rates, base-year revisions, and caveats to ensure data users interpret numbers accurately."
  }
];
