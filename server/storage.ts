import { 
  users, 
  type User, 
  type InsertUser, 
  bodySystems, 
  type BodySystem, 
  type InsertBodySystem,
  diseases,
  type Disease,
  type InsertDisease,
  symptoms,
  type Symptom,
  type InsertSymptom,
  chatHistory,
  type ChatHistory,
  type InsertChatHistory,
  articles,
  type Article,
  type InsertArticle,
  resources,
  type Resource,
  type InsertResource
} from "@shared/schema";

// Storage interface with all necessary CRUD operations
export interface IStorage {
  // User operations (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Body systems operations
  getAllBodySystems(): Promise<BodySystem[]>;
  getBodySystemById(id: number): Promise<BodySystem | undefined>;
  createBodySystem(bodySystem: InsertBodySystem): Promise<BodySystem>;
  
  // Disease operations
  getDiseaseById(id: number): Promise<Disease | undefined>;
  getDiseasesByBodySystem(bodySystemId: number): Promise<Disease[]>;
  searchDiseases(query: string): Promise<Disease[]>;
  createDisease(disease: InsertDisease): Promise<Disease>;
  
  // Symptom operations
  getAllSymptoms(): Promise<Symptom[]>;
  getSymptomById(id: number): Promise<Symptom | undefined>;
  createSymptom(symptom: InsertSymptom): Promise<Symptom>;
  
  // Chat history operations
  getChatHistoryByUserId(userId: number): Promise<ChatHistory[]>;
  createChatHistory(chatHistory: InsertChatHistory): Promise<ChatHistory>;
  
  // Article operations
  getLatestArticles(page: number, limit: number): Promise<Article[]>;
  getArticlesByCategory(category: string, page: number, limit: number): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // Resource operations
  getResourcesByType(type: string, category?: string): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bodySystems: Map<number, BodySystem>;
  private diseases: Map<number, Disease>;
  private symptoms: Map<number, Symptom>;
  private chatHistories: Map<number, ChatHistory>;
  private articles: Map<number, Article>;
  private resources: Map<number, Resource>;
  
  // Current IDs for auto-increment
  private userCurrentId: number;
  private bodySystemCurrentId: number;
  private diseaseCurrentId: number;
  private symptomCurrentId: number;
  private chatHistoryCurrentId: number;
  private articleCurrentId: number;
  private resourceCurrentId: number;

  constructor() {
    this.users = new Map();
    this.bodySystems = new Map();
    this.diseases = new Map();
    this.symptoms = new Map();
    this.chatHistories = new Map();
    this.articles = new Map();
    this.resources = new Map();
    
    this.userCurrentId = 1;
    this.bodySystemCurrentId = 1;
    this.diseaseCurrentId = 1;
    this.symptomCurrentId = 1;
    this.chatHistoryCurrentId = 1;
    this.articleCurrentId = 1;
    this.resourceCurrentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Initialize sample data for testing
  private initializeSampleData() {
    // Sample body systems
    const bodySystems: InsertBodySystem[] = [
      {
        name: "Cardiovascular System",
        description: "The cardiovascular system consists of the heart, blood vessels, and blood. It's responsible for transporting nutrients, hormones, and oxygen to cells throughout the body.",
        imageUrl: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Respiratory System",
        description: "The respiratory system includes the lungs and airways. It facilitates gas exchange, bringing oxygen into the body and removing carbon dioxide.",
        imageUrl: "https://images.pexels.com/photos/5938242/pexels-photo-5938242.jpeg?auto=compress&cs=tinysrgb&w=800&h=450"
      },
      {
        name: "Digestive System",
        description: "The digestive system processes food into nutrients that can be used by the body. It includes the mouth, esophagus, stomach, intestines, and accessory organs.",
        imageUrl: "https://images.unsplash.com/photo-1606206591513-adbfbdd7a177?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Nervous System",
        description: "The nervous system consists of the brain, spinal cord, and nerves. It controls both voluntary and involuntary actions and transmits signals between different parts of the body.",
        imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Endocrine System",
        description: "The endocrine system consists of glands that produce hormones. These hormones regulate metabolism, growth, development, tissue function, and mood.",
        imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66accbc953?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      }
    ];
    
    bodySystems.forEach(bodySystem => this.createBodySystem(bodySystem));
    
    // Sample diseases
    const sampleDiseases: InsertDisease[] = [
      {
        name: "Coronary Artery Disease",
        bodySystemId: 1,
        description: "Coronary artery disease develops when the major blood vessels that supply your heart become damaged or diseased. Cholesterol-containing deposits (plaque) in your coronary arteries and inflammation are usually to blame.",
        causes: "The most common cause is plaque buildup (atherosclerosis) which narrows the coronary arteries and reduces blood flow to the heart. Risk factors include high blood pressure, high cholesterol, smoking, diabetes, and family history.",
        symptoms: "Symptoms include chest pain (angina), shortness of breath, and heart attack. Some people may not experience symptoms until significant blockage has occurred.",
        treatments: "Treatments include lifestyle changes (quitting smoking, eating healthy foods, exercising regularly), medications (statins, beta blockers, aspirin), and procedures (angioplasty, stent placement, bypass surgery).",
        prevention: "Prevention strategies include maintaining a healthy weight, regular exercise, not smoking, controlling blood pressure and cholesterol, and managing stress.",
        imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Asthma",
        bodySystemId: 2,
        description: "Asthma is a condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, wheezing, and shortness of breath.",
        causes: "The exact cause is unknown, but it's likely due to a combination of genetic and environmental factors. Triggers include airborne allergens, respiratory infections, cold air, physical exertion, stress, and certain medications.",
        symptoms: "Symptoms include shortness of breath, chest tightness or pain, wheezing when exhaling, trouble sleeping due to breathing issues, and coughing attacks that are worsened by respiratory viruses.",
        treatments: "Long-term control medications include inhaled corticosteroids, leukotriene modifiers, and long-acting beta agonists. Quick-relief medications include short-acting beta agonists and oral corticosteroids.",
        prevention: "Prevention involves avoiding known triggers, getting vaccinated for influenza and pneumonia, identifying and treating attacks early, and following an asthma action plan.",
        imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Alzheimer's Disease",
        bodySystemId: 4,
        description: "Alzheimer's disease is a progressive neurologic disorder that causes the brain to shrink (atrophy) and brain cells to die. It is the most common cause of dementia — a continuous decline in thinking, behavioral and social skills that affects a person's ability to function independently.",
        causes: "The exact causes aren't fully understood, but scientists believe that for most people, Alzheimer's disease is caused by a combination of genetic, lifestyle and environmental factors that affect the brain over time. Less than 1% of cases are caused by specific genetic changes that guarantee a person will develop the disease.",
        symptoms: "Early signs include forgetting recent events or conversations, and as the disease progresses, a person with Alzheimer's disease will develop severe memory impairment and lose the ability to carry out everyday tasks.",
        treatments: "While there is no cure for Alzheimer's disease, medications can temporarily slow the worsening of symptoms and improve quality of life. These include cholinesterase inhibitors and memantine. Various programs and services can help both people with the disease and their caregivers.",
        prevention: "While there's no proven way to prevent Alzheimer's disease, research suggests that factors such as regular physical exercise, social engagement, maintaining a heart-healthy diet, and mental stimulation may reduce risk.",
        imageUrl: "https://images.unsplash.com/photo-1576671414121-aa0c79a0c69a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Type 2 Diabetes",
        bodySystemId: 5,
        description: "Type 2 diabetes is a chronic condition that affects the way your body metabolizes sugar (glucose). With type 2 diabetes, your body either resists the effects of insulin — a hormone that regulates the movement of sugar into your cells — or doesn't produce enough insulin to maintain normal glucose levels.",
        causes: "Type 2 diabetes primarily occurs as a result of being overweight and lack of physical activity. Genetic factors and family history also play a role. Insulin resistance, where cells do not respond normally to insulin, is a key factor in developing type 2 diabetes.",
        symptoms: "Symptoms include increased thirst, frequent urination, hunger, fatigue, blurred vision, slow-healing sores, frequent infections, and areas of darkened skin.",
        treatments: "Management includes healthy eating, regular exercise, blood sugar monitoring, and sometimes diabetes medications or insulin therapy. Bariatric surgery may be an option for people with severe obesity and type 2 diabetes.",
        prevention: "Lifestyle changes such as maintaining a healthy weight, regular physical activity, and a balanced diet can help prevent or delay the onset of type 2 diabetes.",
        imageUrl: "https://images.unsplash.com/photo-1593476087123-36d1de271f08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Irritable Bowel Syndrome (IBS)",
        bodySystemId: 3,
        description: "Irritable bowel syndrome (IBS) is a common disorder that affects the large intestine. Signs and symptoms include cramping, abdominal pain, bloating, gas, and diarrhea or constipation, or both.",
        causes: "The exact cause is unknown, but factors that appear to play a role include muscle contractions in the intestine, nervous system abnormalities, inflammation in the intestines, severe infection, and changes in gut microflora.",
        symptoms: "Symptoms vary but often include abdominal pain, cramping, bloating, gas, diarrhea or constipation, and mucus in the stool. Symptoms may be triggered by food, stress, or hormonal changes.",
        treatments: "Treatment focuses on symptom relief, including dietary changes, medications for specific symptoms (such as antispasmodics, antidepressants, antibiotics), stress reduction, and probiotics.",
        prevention: "While IBS cannot be prevented, symptoms can be managed by avoiding trigger foods, managing stress, getting regular exercise, and ensuring adequate sleep.",
        imageUrl: "https://images.unsplash.com/photo-1565071559227-20ab25b7685e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      }
    ];
    
    sampleDiseases.forEach(disease => this.createDisease(disease));
    
    // Sample symptoms
    const sampleSymptoms: InsertSymptom[] = [
      { name: "Chest pain", bodySystemId: 1, description: "Discomfort or pain in the chest area, which may feel like pressure, burning, tightness, or sharpness." },
      { name: "Shortness of breath", bodySystemId: 2, description: "Difficulty breathing or feeling like you cannot get enough air." },
      { name: "Fatigue", bodySystemId: null, description: "Extreme tiredness that doesn't improve with rest." },
      { name: "Headache", bodySystemId: 4, description: "Pain in any region of the head." },
      { name: "Dizziness", bodySystemId: 4, description: "Feeling faint, woozy, or unsteady." },
      { name: "Nausea", bodySystemId: 3, description: "Feeling of sickness with an inclination to vomit." },
      { name: "Abdominal pain", bodySystemId: 3, description: "Pain felt between the chest and groin." },
      { name: "Fever", bodySystemId: null, description: "Body temperature above the normal range of 98.6°F (37°C)." },
      { name: "Cough", bodySystemId: 2, description: "Sudden expulsion of air from the lungs to clear airways." },
      { name: "Wheezing", bodySystemId: 2, description: "High-pitched whistling sound during breathing, often due to narrowed airways." },
      { name: "Joint pain", bodySystemId: null, description: "Discomfort, aches, or soreness in any of the body's joints." },
      { name: "Muscle weakness", bodySystemId: null, description: "Reduced strength in one or more muscles." },
      { name: "Memory problems", bodySystemId: 4, description: "Difficulty recalling information or events." },
      { name: "Blurred vision", bodySystemId: 4, description: "Lack of sharpness in vision with objects appearing out of focus." },
      { name: "Increased thirst", bodySystemId: 5, description: "Abnormal feeling of needing to drink fluids." },
      { name: "Frequent urination", bodySystemId: 5, description: "Need to urinate more often than usual." },
      { name: "Weight loss (unexplained)", bodySystemId: null, description: "Losing weight without trying through diet, exercise, or lifestyle changes." },
      { name: "Rash", bodySystemId: null, description: "Area of irritated or swollen skin that can be itchy, red, painful, or warm." },
      { name: "Swelling", bodySystemId: null, description: "Enlargement of a body part due to fluid retention or other causes." },
      { name: "Heart palpitations", bodySystemId: 1, description: "Sensations of a pounding, racing, or fluttering heart." }
    ];
    
    sampleSymptoms.forEach(symptom => this.createSymptom(symptom));
    
    // Sample articles
    const sampleArticles: InsertArticle[] = [
      {
        title: "Breakthrough in Alzheimer's Treatment Shows Promise in Clinical Trials",
        content: "A new drug targeting amyloid plaques in the brain has shown significant cognitive improvement in early-stage Alzheimer's patients during Phase 3 clinical trials. The drug, which uses a novel approach to clear these harmful protein buildups, could potentially slow or even halt disease progression in some patients.\n\nResearchers reported that patients receiving the treatment demonstrated 27% less cognitive decline over an 18-month period compared to those receiving a placebo. The clinical trials involved over 1,700 participants across 22 countries.\n\n\"These results represent the most promising advancement in Alzheimer's treatment we've seen in decades,\" said Dr. Elizabeth Chen, lead researcher on the study. \"While this is not a cure, it could significantly improve quality of life for millions of patients and their families.\"\n\nThe treatment is now undergoing review by regulatory authorities and could become available to patients within the next two years if approved.",
        summary: "Researchers report significant cognitive improvements in early-stage patients using a novel targeted therapy approach.",
        imageUrl: "https://images.unsplash.com/photo-1581093450021-a7a0e6e7e35f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Neurology",
        source: "Journal of Neurology",
        publishedAt: new Date("2023-05-15T00:00:00.000Z")
      },
      {
        title: "AI-Powered Diagnostic Tool Achieves 94% Accuracy in Cancer Detection",
        content: "A new artificial intelligence system developed by researchers at Stanford University has demonstrated remarkable accuracy in identifying early-stage tumors from medical imaging. The deep learning algorithm, trained on over 100,000 anonymized medical images, correctly identified malignancies with 94% accuracy across multiple cancer types, including lung, breast, and colorectal cancers.\n\nThe technology may help address the critical shortage of radiologists in many regions while potentially reducing diagnostic errors. The system was particularly effective at detecting subtle patterns that human observers sometimes miss.\n\n\"What makes this system unique is its ability to provide explanations for its decisions,\" said Dr. James Wong, principal investigator. \"It doesn't just make a diagnosis but highlights the specific areas and features that led to its conclusion, making it a collaborative tool for healthcare professionals rather than a replacement.\"\n\nIn a validation study involving 53 radiologists, diagnoses supported by the AI tool showed a 22% reduction in false negatives compared to human interpretation alone. The team is now working with regulatory agencies to begin clinical implementation.",
        summary: "New machine learning algorithm shows exceptional performance in identifying early-stage tumors from medical imaging.",
        imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Technology",
        source: "Digital Medicine Today",
        publishedAt: new Date("2023-05-10T00:00:00.000Z")
      },
      {
        title: "Large-Scale Study Identifies New Genetic Markers for Heart Disease Risk",
        content: "A groundbreaking international study involving genetic data from over 1.4 million individuals has identified 58 previously unknown genetic variants associated with increased risk of cardiovascular disease. The research, a collaboration between scientists from 42 institutions across 7 countries, represents the largest genetic study of heart disease risk factors ever conducted.\n\nThe newly identified genetic markers provide valuable insights into biological pathways that influence heart health and could lead to more personalized risk assessment and targeted prevention strategies. Several of the genetic variants affect biological pathways not previously linked to heart disease.\n\n\"What's particularly exciting about these findings is that they open up entirely new avenues for therapeutic intervention,\" said Dr. Sarah Martinez, co-author of the study. \"We've discovered genetic variants affecting inflammatory pathways we didn't previously associate with cardiovascular risk.\"\n\nResearchers are already working on developing new risk prediction algorithms that incorporate these genetic markers alongside traditional risk factors like cholesterol levels, blood pressure, and smoking status. Such tools could help physicians identify high-risk patients who might benefit from earlier or more aggressive preventive measures.",
        summary: "International research consortium discovers multiple genetic variants associated with increased cardiovascular risk.",
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Cardiology",
        source: "Cardiology Research",
        publishedAt: new Date("2023-05-05T00:00:00.000Z")
      },
      {
        title: "New Vaccine Technology Offers Hope for Preventing Future Pandemics",
        content: "Scientists at the National Institutes of Health have developed a groundbreaking vaccine platform that could dramatically reduce the time needed to create effective vaccines against novel pathogens. The technology, which utilizes self-amplifying RNA (saRNA), demonstrated remarkable versatility in preclinical studies by generating strong immune responses against multiple test viruses.\n\nUnlike traditional vaccine development, which can take years, this platform could potentially create candidate vaccines within weeks of identifying a new pathogen. The approach builds on lessons learned from the COVID-19 pandemic but incorporates several technological advances that improve stability, reduce side effects, and enhance immune response.\n\n\"This represents a significant leap forward in our pandemic preparedness toolkit,\" said Dr. Robert Kumar, lead developer of the technology. \"Rather than starting from scratch each time a new threat emerges, we now have a flexible platform that can be quickly adapted to target novel pathogens.\"\n\nThe research team is now working with international health organizations to establish a global network of manufacturing facilities capable of rapidly producing vaccines based on this technology when needed. Clinical trials for influenza and dengue fever vaccines using this platform are already underway.",
        summary: "Scientists develop a versatile platform for rapid vaccine creation that could dramatically reduce response time to novel pathogens.",
        imageUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Immunology",
        source: "Vaccine Research Journal",
        publishedAt: new Date("2023-04-28T00:00:00.000Z")
      },
      {
        title: "Innovative Non-Invasive Treatment for Chronic Pain Shows Promising Results",
        content: "A novel non-invasive treatment using focused ultrasound technology has shown significant promise in reducing chronic pain according to a multi-center clinical trial published this week. The treatment, which precisely targets and temporarily deactivates specific nerve pathways without damaging surrounding tissues, provided substantial pain relief for patients with conditions including neuropathy, complex regional pain syndrome, and lower back pain.\n\nIn the study involving 248 patients with chronic pain resistant to conventional treatments, 73% reported a reduction in pain of at least 50% after four weeks of treatment, with effects lasting up to six months in most respondents. Importantly, the treatment avoided the side effects and risks associated with opioid medications and invasive surgical interventions.\n\n\"This approach represents a potential paradigm shift in chronic pain management,\" said Dr. Alisha Patel, principal investigator. \"It provides precisely targeted relief without the systemic effects of medications or the risks of surgery.\"\n\nThe technology uses multiple low-intensity ultrasound beams that pass harmlessly through tissue but converge at specific deep targets to produce therapeutic effects. The treatment can be customized for each patient's specific pain condition and anatomy.\n\nRegulatory approval for the technology is expected within the next year.",
        summary: "Clinical trials demonstrate significant pain reduction in patients with long-term conditions using targeted ultrasound therapy.",
        imageUrl: "https://images.unsplash.com/photo-1631815588090-d1bcbe9b4c25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Pain Management",
        source: "Journal of Pain Medicine",
        publishedAt: new Date("2023-04-20T00:00:00.000Z")
      },
      {
        title: "Gut Microbiome Linked to Mental Health in Groundbreaking Research",
        content: "In a landmark study published in Nature Neuroscience, researchers have established clear connections between gut microbiome composition and several psychiatric conditions, including depression, anxiety, and bipolar disorder. The research, which analyzed gut bacteria profiles and mental health data from over 10,000 participants, is the largest study of its kind to date.\n\nScientists discovered specific bacterial signatures associated with different mental health conditions, with significant differences in the microbiome diversity and composition between affected individuals and healthy controls. The findings suggest that the gut-brain connection may play a much larger role in psychiatric disorders than previously recognized.\n\n\"What's particularly compelling is the consistency of these associations across diverse populations,\" said Dr. Michael Rodriguez, lead author of the study. \"We're seeing the same patterns in participants from different countries, diets, and genetic backgrounds.\"\n\nThe research also identified several mechanisms through which gut bacteria may influence brain function, including through the production of neuroactive compounds, regulation of inflammation, and effects on the stress response system.\n\nClinical trials investigating targeted probiotic interventions based on these findings are now being planned, potentially opening a new frontier in the treatment of psychiatric disorders.",
        summary: "Scientists establish clear connections between gut bacteria composition and several psychiatric conditions in large-scale study.",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Mental Health",
        source: "Microbiome Research",
        publishedAt: new Date("2023-04-15T00:00:00.000Z")
      }
    ];
    
    sampleArticles.forEach(article => this.createArticle(article));
    
    // Sample resources
    const sampleResources: InsertResource[] = [
      {
        title: "NEJM (New England Journal of Medicine)",
        description: "The world's leading medical journal featuring the latest medical research and reviews.",
        url: "https://www.nejm.org/",
        type: "journal",
        category: "professional"
      },
      {
        title: "UpToDate",
        description: "Evidence-based clinical decision support resource with thousands of topics for medical professionals.",
        url: "https://www.uptodate.com/",
        type: "reference",
        category: "professional"
      },
      {
        title: "MedlinePlus",
        description: "The National Institutes of Health's website for patients, providing reliable, up-to-date health information.",
        url: "https://medlineplus.gov/",
        type: "website",
        category: "patient"
      },
      {
        title: "CDC (Centers for Disease Control and Prevention)",
        description: "Provides health information and resources on diseases, conditions, and public health topics.",
        url: "https://www.cdc.gov/",
        type: "organization",
        category: "patient"
      },
      {
        title: "Mayo Clinic",
        description: "Leading academic medical center focusing on integrated clinical practice, education, and research.",
        url: "https://www.mayoclinic.org/",
        type: "hospital",
        category: "hospital",
        location: "Rochester, MN (main campus)"
      },
      {
        title: "Cleveland Clinic",
        description: "Nonprofit multispecialty academic medical center that integrates clinical and hospital care with research and education.",
        url: "https://my.clevelandclinic.org/",
        type: "hospital",
        category: "hospital",
        location: "Cleveland, OH"
      }
    ];
    
    sampleResources.forEach(resource => this.createResource(resource));
  }

  // User operations (kept from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Body systems operations
  async getAllBodySystems(): Promise<BodySystem[]> {
    return Array.from(this.bodySystems.values());
  }
  
  async getBodySystemById(id: number): Promise<BodySystem | undefined> {
    return this.bodySystems.get(id);
  }
  
  async createBodySystem(bodySystem: InsertBodySystem): Promise<BodySystem> {
    const id = this.bodySystemCurrentId++;
    const newBodySystem: BodySystem = { ...bodySystem, id };
    this.bodySystems.set(id, newBodySystem);
    return newBodySystem;
  }
  
  // Disease operations
  async getDiseaseById(id: number): Promise<Disease | undefined> {
    return this.diseases.get(id);
  }
  
  async getDiseasesByBodySystem(bodySystemId: number): Promise<Disease[]> {
    return Array.from(this.diseases.values()).filter(
      disease => disease.bodySystemId === bodySystemId
    );
  }
  
  async searchDiseases(query: string): Promise<Disease[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.diseases.values()).filter(
      disease => 
        disease.name.toLowerCase().includes(lowercaseQuery) ||
        (disease.description && disease.description.toLowerCase().includes(lowercaseQuery)) ||
        (disease.symptoms && disease.symptoms.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  async createDisease(disease: InsertDisease): Promise<Disease> {
    const id = this.diseaseCurrentId++;
    const newDisease: Disease = { ...disease, id };
    this.diseases.set(id, newDisease);
    return newDisease;
  }
  
  // Symptom operations
  async getAllSymptoms(): Promise<Symptom[]> {
    return Array.from(this.symptoms.values());
  }
  
  async getSymptomById(id: number): Promise<Symptom | undefined> {
    return this.symptoms.get(id);
  }
  
  async createSymptom(symptom: InsertSymptom): Promise<Symptom> {
    const id = this.symptomCurrentId++;
    const newSymptom: Symptom = { ...symptom, id };
    this.symptoms.set(id, newSymptom);
    return newSymptom;
  }
  
  // Chat history operations
  async getChatHistoryByUserId(userId: number): Promise<ChatHistory[]> {
    return Array.from(this.chatHistories.values()).filter(
      chat => chat.userId === userId
    );
  }
  
  async createChatHistory(chatHistory: InsertChatHistory): Promise<ChatHistory> {
    const id = this.chatHistoryCurrentId++;
    const newChatHistory: ChatHistory = { 
      ...chatHistory, 
      id, 
      createdAt: new Date() 
    };
    this.chatHistories.set(id, newChatHistory);
    return newChatHistory;
  }
  
  // Article operations
  async getLatestArticles(page: number = 1, limit: number = 10): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return articles.slice(startIndex, endIndex);
  }
  
  async getArticlesByCategory(category: string, page: number = 1, limit: number = 10): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.category === category)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return articles.slice(startIndex, endIndex);
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.articleCurrentId++;
    const newArticle: Article = { 
      ...article, 
      id, 
      publishedAt: new Date(article.publishedAt || new Date()) 
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }
  
  // Resource operations
  async getResourcesByType(type: string, category?: string): Promise<Resource[]> {
    let resources = Array.from(this.resources.values());
    
    if (type !== 'all') {
      resources = resources.filter(resource => resource.type === type);
    }
    
    if (category) {
      resources = resources.filter(resource => resource.category === category);
    }
    
    return resources;
  }
  
  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.resourceCurrentId++;
    const newResource: Resource = { ...resource, id };
    this.resources.set(id, newResource);
    return newResource;
  }
}

export const storage = new MemStorage();
