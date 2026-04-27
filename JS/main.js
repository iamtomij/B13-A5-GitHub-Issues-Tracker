// API
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SINGLE_API = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
const SEARCH_API = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

const issueContainer = document.getElementById("issue-container");
const spinner = document.getElementById("spinner");

// modal
const modal = document.getElementById("issue_modal");
const modalContent = document.getElementById("modal-content");

// buttons
const btnAll = document.getElementById("btn-all");
const btnOpen = document.getElementById("btn-open");
const btnClosed = document.getElementById("btn-closed");

// search
const searchInput = document.getElementById("search-input");
const btnSearch = document.getElementById("btn-search");

let allIssues = [];

// load all issues
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

// display issues
const displayIssues = (issues) => {
   issueContainer.innerHTML = "";

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
         <h2 class="font-semibold text-[14px] mb-2 line-clamp-1">${issue.title}</h2>

         <p class="text-[12px] text-[#64748B] mb-3 line-clamp-2">
            ${issue.description}...
         </p>
         


         <div class="mb-4 flex flex-wrap gap-1">${issue.labels.map(label => {
         let colorClass = "";
         if (label.toLowerCase() === "bug") {
            colorClass = "font-medium bg-red-200 text-red-600 rounded-full px-3 py-2";
         }
         else if (label.toLowerCase() === "documentation") {
            colorClass = "font-medium bg-gray-200 text-black rounded-full";
         }
         else if (label.toLowerCase() === "duplicate") {
            colorClass = "font-medium bg-[#A855F740] text-secondary-content rounded-full";
         }
         else if (label.toLowerCase() === "enhancement") {
            colorClass = "font-medium bg-[#BBF7D0] text-[#00A96E] rounded-full";
         }
         else if (label.toLowerCase() === "good first issue") {
            colorClass = "font-medium bg-[#9CA3AF40] text-accent-content rounded-full";
         }
         else if (label.toLowerCase() === "help wanted") {
            colorClass = "font-medium bg-yellow-200 text-yellow-700 rounded-full px-3 py-2";
         }
         else {
            colorClass = "font-medium bg-gray-200 ";
         }

         return `
         <button class="text-[10px] px-2 py-[2px] rounded ${colorClass}">
            ${label.toUpperCase()}
            
         </button>
         `;
      }).join("")}
         </div>

         <hr class="border-gray-200 " />

         <div class="text-xs space-y-2 mt-2">
            
            <p class="font-normal text-[12px] text-[#64748B]"># ${issue.author}</p>
            <p class="font-normal text-[12px] text-[#64748B]"> ${new Date(issue.createdAt).toLocaleString()}</p>
         </div>
      `;

      // modal click
      card.addEventListener("click", () => {
         loadSingleIssue(issue.id);
      });

      issueContainer.appendChild(card);
   });
};

// single issue
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
   if (issue.priority.toLowerCase() === "high") {
      priorityClass = "badge-error";
   } else if (issue.priority.toLowerCase() === "medium") {
      priorityClass = "badge-warning";
   } else {
      priorityClass = "badge-success";
   }

   modalContent.innerHTML = `
    
    <!-- Title -->
    <h2 class="text-[24px] font-bold mb-2">
      ${issue.title}
    </h2>

    <!-- Status + Meta -->
    <div class="flex items-center gap-7 text-sm text-gray-500 mb-3 ">
      <span class="badge ${statusClass} badge-md rounded-3xl font-medium text-[12px] capitalize">
        ${issue.status}
      </span>
      <span class="text-[12px] font-normal">Opened by ${issue.author}</span>
      <span class="text-[12px] font-normal">${issue.createdAt}</span>
    </div>

    <!-- Labels -->
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
        <span class="badge ${priorityClass} badge-sm uppercase">
          ${issue.priority}
        </span>
      </div>

    </div>

  `;

   modal.showModal();
};

// active button
const setActive = (activeBtn) => {
   [btnAll, btnOpen, btnClosed].forEach(btn => {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
   });

   activeBtn.classList.remove("btn-outline");
   activeBtn.classList.add("btn-primary");
};

// tabs
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

// search functionality
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

// enter press search
searchInput.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
      btnSearch.click();
   }
});

// initial load
loadIssues();
setActive(btnAll);