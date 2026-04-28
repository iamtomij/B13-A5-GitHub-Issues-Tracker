// API
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SINGLE_API = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
const SEARCH_API = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

const issueContainer = document.getElementById("issue-container");
const issueCountTitle = document.getElementById("issue-count");
const spinner = document.getElementById("spinner");

// modal
const modal = document.getElementById("issue_modal");
const modalContent = document.getElementById("modal-content");

// buttons
const btnAll = document.getElementById("btn-all");
const btnOpen = document.getElementById("btn-open");
const btnClosed = document.getElementById("btn-closed");


btnAll.addEventListener("click", () => {
   setActive(btnAll);
   displayIssues(allIssues);
   updateTitleCount(allIssues);
});

btnOpen.addEventListener("click", () => {
   setActive(btnOpen);
   const openIssues = allIssues.filter(i => i.status === "open");
   displayIssues(openIssues);
   updateTitleCount(openIssues);
});

btnClosed.addEventListener("click", () => {
   setActive(btnClosed);
   const closedIssues = allIssues.filter(i => i.status === "closed");
   displayIssues(closedIssues);
   updateTitleCount(closedIssues);
});

const searchInput = document.getElementById("search-input");
const btnSearch = document.getElementById("btn-search");

let allIssues = [];

const loadIssues = async () => {
   try {
      spinner.classList.remove("hidden");

      const res = await fetch(API_URL);
      const data = await res.json();

      allIssues = data.data;

      displayIssues(allIssues);
   } catch (err) {
      // console.error("Error loading issues:", err);
   } finally {
      spinner.classList.add("hidden");
   }
};

const updateTitleCount = (issues) => {
   issueCountTitle.innerText = `${issues.length} Issues`;
};

// status icon
const getStatusIcon = (status) => {
   if (status === "open") {
      return `
      <div class="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600">
         <i class="fa-regular fa-circle-dot"></i>
      </div>`;
   } else {
      return `
      <div class="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
         <i class="fa-solid fa-circle-check"></i>
      </div>`;
   }
};


const getPriorityBadge = (priority) => {
   const p = (priority || "").toLowerCase();

   if (p === "high") {
      return `<span class="text-[12px] px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium">HIGH</span>`;
   } else if (p === "medium") {
      return `<span class="text-[12px] px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 font-medium">MEDIUM</span>`;
   } else {
      return `<span class="text-[12px] px-3 py-1 rounded-full bg-gray-200 text-gray-600 font-medium">LOW</span>`;
   }
};

const displayIssues = (issues) => {
   issueContainer.innerHTML = "";

   updateTitleCount(issues);

   if (issues.length === 0) {
      issueContainer.innerHTML = `<p class="text-center text-gray-500">No issues found</p>`;
      return;
   }

   issues.forEach(issue => {
      const card = document.createElement("div");

      const borderColor =
         issue.status === "open"
            ? "border-t-4 border-green-500"
            : "border-t-4 border-[#A855F7]";

      card.className = `
         bg-white p-7 rounded shadow-sm ${borderColor}
         cursor-pointer hover:shadow-md transition space-y-3
      `;

      card.innerHTML = `

         <div class="flex justify-between items-center mb-2">
            ${getStatusIcon(issue.status)}
            ${getPriorityBadge(issue.priority)}
         </div>

         <h2 class="font-semibold text-[14px] mb-2 line-clamp-1">${issue.title}</h2>

         <p class="text-[12px] text-[#64748B] mb-3 line-clamp-2">
            ${issue.description || ""}...
         </p>

         <div class="mb-4 flex flex-wrap gap-1">
            ${(issue.labels || []).map(label => {

         let colorClass = "";

         if (label.toLowerCase() === "bug") {
            colorClass = "bg-red-200 text-red-600";
         }
         else if (label.toLowerCase() === "documentation") {
            colorClass = "bg-gray-200 text-black";
         }
         else if (label.toLowerCase() === "duplicate") {
            colorClass = "bg-purple-100 text-purple-600";
         }
         else if (label.toLowerCase() === "enhancement") {
            colorClass = "bg-green-100 text-green-600";
         }
         else if (label.toLowerCase() === "good first issue") {
            colorClass = "bg-gray-100 text-gray-600";
         }
         else if (label.toLowerCase() === "help wanted") {
            colorClass = "bg-yellow-200 text-yellow-700";
         }
         else {
            colorClass = "bg-gray-200 text-gray-600";
         }

         return `
               <button class="text-[10px] px-2 py-[2px] rounded-full font-medium ${colorClass}">
                  ${label.toUpperCase()}
               </button>
               `;
      }).join("")}
         </div>

         <hr class="border-gray-200 " />

         <!-- FOOTER -->
         <div class="text-xs space-y-2 mt-2">
            <p class="text-[12px] text-[#64748B]"># ${issue.author}</p>
            <p class="text-[12px] text-[#64748B]">
               ${new Date(issue.createdAt).toLocaleString()}
            </p>
         </div>
      `;

      card.addEventListener("click", () => {
         loadSingleIssue(issue.id);
      });

      issueContainer.appendChild(card);
   });
};

const loadSingleIssue = async (id) => {
   try {
      const res = await fetch(SINGLE_API + id);
      const data = await res.json();
      showModal(data.data);
   } catch (err) {
      // console.error("Error loading single issue:", err);
   }
};

const showModal = (issue) => {

   const statusClass = issue.status.toLowerCase() === "open"
      ? "badge-success"
      : "badge-primary";

   let priorityClass = "";
   const p = (issue.priority || "").toLowerCase();

   if (p === "high") {
      priorityClass = "bg-red-100 text-red-600 font-medium border-none"; 
   } else if (p === "medium") {
      priorityClass = "bg-yellow-200 text-yellow-700 text-[14px] font-medium border-none"; 
   } else if (p === "low") {
      priorityClass = "bg-gray-200 text-gray-600 font-medium border-none"; 
   } else {
      priorityClass = "bg-gray-300 text-gray-800 border-none";
   }

   modalContent.innerHTML = `
     
     <h2 class="text-[24px] font-bold mb-2">
       ${issue.title}
     </h2>
 
     <div class="flex items-center gap-7 text-sm text-gray-500 mb-3 ">
       <span class="badge ${statusClass} badge-md rounded-3xl font-medium text-[12px] capitalize">
         ${issue.status}
       </span>
       <span class="text-[12px] font-normal">Opened by ${issue.author}</span>
       <span class="text-[12px] font-normal">${issue.createdAt}</span>
     </div>
 
     <div class="mb-3 flex flex-wrap gap-2">
       ${issue.labels.map(label => {

      let colorClass = "";

      if (label.toLowerCase() === "bug") {
         colorClass = "bg-red-200 text-red-600";
      }
      else if (label.toLowerCase() === "help wanted") {
         colorClass = "bg-yellow-200 text-yellow-700";
      }
      else {
         colorClass = "bg-gray-200 text-gray-600";
      }

      return `
           <span class="text-xs px-2 py-1 rounded-full font-medium ${colorClass}">
             ${label.toUpperCase()}
           </span>
         `;
   }).join("")}
     </div>
     <p class="text-sm text-gray-600 mb-4">
       ${issue.description}
     </p>
     <div class="bg-gray-100 p-4 rounded-lg flex items-center gap-20 mb-4">
       
       <div>
         <p class="text-sm text-gray-500">Assignee:</p>
         <p class="font-semibold">${issue.assignee}</p>
       </div>
 
       <div>
         <p class="text-sm text-gray-500">Priority:</p>
         <span class="badge ${priorityClass} badge-md rounded-3xl uppercase font-bold px-4">
           ${issue.priority}
         </span>
       </div>
 
     </div>
 
   `;

   modal.showModal();
};

const setActive = (activeBtn) => {
   [btnAll, btnOpen, btnClosed].forEach(btn => {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
   });

   activeBtn.classList.remove("btn-outline");
   activeBtn.classList.add("btn-primary");
};

btnAll.addEventListener("click", () => {
   setActive(btnAll);
   displayIssues(allIssues);
});

btnOpen.addEventListener("click", () => {
   setActive(btnOpen);
   const openIssues = allIssues.filter(i => i.status === "open");
   displayIssues(openIssues);
});

btnClosed.addEventListener("click", () => {
   setActive(btnClosed);
   const closedIssues = allIssues.filter(i => i.status === "closed");
   displayIssues(closedIssues);
});

btnSearch.addEventListener("click", async () => {
   const text = searchInput.value.trim();

   if (!text) return;

   try {
      spinner.classList.remove("hidden");

      const res = await fetch(SEARCH_API + text);
      const data = await res.json();

      displayIssues(data.data);
   } catch (err) {
      // console.error("Search error:", err);
   } finally {
      spinner.classList.add("hidden");
   }
});

searchInput.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
      btnSearch.click();
   }
});

loadIssues();
setActive(btnAll);