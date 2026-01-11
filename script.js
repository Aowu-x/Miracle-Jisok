// Miracle Jisok - Dress-up Game

// Image counts
const HAIR_COUNT = 12;
const OUTFIT_COUNT = 114;
const GUITAR_COUNT = 2;
const ACC_COUNT = 7;
const OUTFIT_PER_PAGE = 24;

// Current selections
let hairIdx = 1;
let outfitIdx = 1;
let guitarIdx = null;
let accIdx = null;

// Outfit pagination
let outfitPage = 1;
let outfitSearchValue = "";

// Get image elements
const baseImg = document.getElementById("base");
const hairImg = document.getElementById("hair");
const outfitImg = document.getElementById("outfit");
const guitarImg = document.getElementById("guitar");
const accImg = document.getElementById("acc");

// Get thumbnail containers
const hairThumbnails = document.getElementById("hairThumbnails");
const outfitThumbnails = document.getElementById("outfitThumbnails");
const guitarThumbnails = document.getElementById("guitarThumbnails");
const accThumbnails = document.getElementById("accThumbnails");

// Get outfit controls
const outfitSearch = document.getElementById("outfitSearch");
const outfitPrev = document.getElementById("outfitPrev");
const outfitNext = document.getElementById("outfitNext");
const outfitPageInfo = document.getElementById("outfitPageInfo");

// Get back to top button
const backToTopBtn = document.getElementById("backToTop");

// Get modal elements (will be initialized in setupModal)
let aboutBtn;
let aboutModal;
let modalClose;
let modalOverlay;

// Initialize on page load
window.addEventListener("DOMContentLoaded", function() {
  baseImg.src = "images/base/base.png";
  
  // Set default selections
  selectHair(1);
  selectOutfit(1);
  selectGuitar(null);
  selectAcc(null);
  
  // Build thumbnail grids
  buildHairThumbnails();
  buildGuitarThumbnails();
  buildAccThumbnails();
  buildOutfitThumbnails();
  
  // Setup outfit controls
  outfitSearch.addEventListener("input", handleOutfitSearch);
  outfitPrev.addEventListener("click", () => changeOutfitPage(-1));
  outfitNext.addEventListener("click", () => changeOutfitPage(1));
  
  // Setup back to top button
  setupBackToTop();
  
  // Setup modal
  setupModal();
});

// Back to Top functionality
function setupBackToTop() {
  // Show/hide button based on scroll position
  window.addEventListener("scroll", function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
  // Keyboard support
  backToTopBtn.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });
}

// Modal functionality
function setupModal() {
  // Get modal elements
  aboutBtn = document.getElementById("aboutBtn");
  aboutModal = document.getElementById("aboutModal");
  modalClose = document.getElementById("modalClose");
  modalOverlay = aboutModal.querySelector(".modal-overlay");
  const modalContent = aboutModal.querySelector(".modal-content");
  
  // Open modal when About button is clicked
  aboutBtn.addEventListener("click", function() {
    openModal();
  });
  
  // Close modal when Close button is clicked
  modalClose.addEventListener("click", function() {
    closeModal();
  });
  
  // Close modal when clicking on overlay
  modalOverlay.addEventListener("click", function() {
    closeModal();
  });
  
  // Close modal on ESC key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && aboutModal && aboutModal.classList.contains("active")) {
      closeModal();
    }
  });
  
  // Prevent modal content clicks from closing modal
  modalContent.addEventListener("click", function(e) {
    e.stopPropagation();
  });
}

function openModal() {
  aboutModal.classList.add("active");
  aboutModal.setAttribute("aria-hidden", "false");
  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
}

function closeModal() {
  aboutModal.classList.remove("active");
  aboutModal.setAttribute("aria-hidden", "true");
  // Restore body scroll
  document.body.style.overflow = "";
}

// Helper function to pad numbers with zeros
function pad(num, size) {
  let s = num.toString();
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

// Selection functions
function selectHair(index) {
  hairIdx = index;
  hairImg.src = `images/hair/hair_${pad(index, 3)}.png`;
  hairImg.style.display = "block";
  updateThumbnailSelection("hair", index);
}

function selectOutfit(index) {
  outfitIdx = index;
  outfitImg.src = `images/outfit/outfit_${pad(index, 4)}.png`;
  outfitImg.style.display = "block";
  updateThumbnailSelection("outfit", index);
}

function selectGuitar(index) {
  guitarIdx = index;
  if (index !== null) {
    guitarImg.src = `images/guitar/guitar_${pad(index, 3)}.png`;
    guitarImg.style.display = "block";
  } else {
    guitarImg.src = "";
    guitarImg.style.display = "none";
  }
  updateThumbnailSelection("guitar", index);
}

function selectAcc(index) {
  accIdx = index;
  if (index !== null) {
    accImg.src = `images/acc/acc_${pad(index, 3)}.png`;
    accImg.style.display = "block";
  } else {
    accImg.src = "";
    accImg.style.display = "none";
  }
  updateThumbnailSelection("acc", index);
}

// Build thumbnail grids
function buildHairThumbnails() {
  hairThumbnails.innerHTML = "";
  for (let i = 1; i <= HAIR_COUNT; i++) {
    const thumb = createThumbnail("hair", i, `images/hair/hair_${pad(i, 3)}.png`);
    if (i === hairIdx) thumb.classList.add("selected");
    hairThumbnails.appendChild(thumb);
  }
}

function buildGuitarThumbnails() {
  guitarThumbnails.innerHTML = "";
  
  // Add "None" tile
  const noneTile = createNoneTile("guitar");
  if (guitarIdx === null) noneTile.classList.add("selected");
  guitarThumbnails.appendChild(noneTile);
  
  // Add guitar thumbnails
  for (let i = 1; i <= GUITAR_COUNT; i++) {
    const thumb = createThumbnail("guitar", i, `images/guitar/guitar_${pad(i, 3)}.png`);
    if (i === guitarIdx) thumb.classList.add("selected");
    guitarThumbnails.appendChild(thumb);
  }
}

function buildAccThumbnails() {
  accThumbnails.innerHTML = "";
  
  // Add "None" tile
  const noneTile = createNoneTile("acc");
  if (accIdx === null) noneTile.classList.add("selected");
  accThumbnails.appendChild(noneTile);
  
  // Add accessory thumbnails
  for (let i = 1; i <= ACC_COUNT; i++) {
    const thumb = createThumbnail("acc", i, `images/acc/acc_${pad(i, 3)}.png`);
    if (i === accIdx) thumb.classList.add("selected");
    accThumbnails.appendChild(thumb);
  }
}

function buildOutfitThumbnails() {
  outfitThumbnails.innerHTML = "";
  
  let outfits = [];
  if (outfitSearchValue) {
    // Filter by search
    const searchNum = parseInt(outfitSearchValue);
    if (searchNum >= 1 && searchNum <= OUTFIT_COUNT) {
      outfits = [searchNum];
      outfitPage = 1;
    }
  } else {
    // Pagination mode
    const start = (outfitPage - 1) * OUTFIT_PER_PAGE + 1;
    const end = Math.min(start + OUTFIT_PER_PAGE - 1, OUTFIT_COUNT);
    for (let i = start; i <= end; i++) {
      outfits.push(i);
    }
  }
  
  if (outfits.length === 0) {
    outfitThumbnails.innerHTML = '<div class="no-results">No outfits found</div>';
    return;
  }
  
  outfits.forEach(index => {
    const thumb = createThumbnail("outfit", index, `images/outfit/outfit_${pad(index, 4)}.png`);
    if (index === outfitIdx) thumb.classList.add("selected");
    outfitThumbnails.appendChild(thumb);
  });
  
  updateOutfitPagination();
}

function createThumbnail(category, index, src) {
  const thumb = document.createElement("div");
  thumb.className = "thumbnail";
  thumb.dataset.category = category;
  thumb.dataset.index = index;
  thumb.setAttribute("role", "button");
  thumb.setAttribute("tabindex", "0");
  thumb.setAttribute("aria-label", `Select ${category} ${index}`);
  
  const img = document.createElement("img");
  img.src = src;
  img.alt = `${category} ${index}`;
  img.setAttribute("aria-hidden", "true");
  
  thumb.appendChild(img);
  thumb.addEventListener("click", () => handleThumbnailClick(category, index));
  thumb.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleThumbnailClick(category, index);
    }
  });
  
  return thumb;
}

function createNoneTile(category) {
  const tile = document.createElement("div");
  tile.className = "thumbnail none-tile";
  tile.dataset.category = category;
  tile.dataset.index = "none";
  tile.textContent = "None";
  tile.setAttribute("role", "button");
  tile.setAttribute("tabindex", "0");
  tile.setAttribute("aria-label", `Select no ${category}`);
  tile.addEventListener("click", () => handleThumbnailClick(category, null));
  tile.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleThumbnailClick(category, null);
    }
  });
  return tile;
}

function handleThumbnailClick(category, index) {
  switch (category) {
    case "hair":
      selectHair(index);
      break;
    case "outfit":
      selectOutfit(index);
      break;
    case "guitar":
      selectGuitar(index);
      break;
    case "acc":
      selectAcc(index);
      break;
  }
}

function updateThumbnailSelection(category, selectedIndex) {
  const container = document.getElementById(`${category}Thumbnails`);
  const thumbnails = container.querySelectorAll(".thumbnail");
  
  thumbnails.forEach(thumb => {
    thumb.classList.remove("selected");
    const thumbIndex = thumb.dataset.index;
    
    if (thumbIndex === "none" && selectedIndex === null) {
      thumb.classList.add("selected");
    } else if (thumbIndex && parseInt(thumbIndex) === selectedIndex) {
      thumb.classList.add("selected");
    }
  });
}

// Outfit search and pagination
function handleOutfitSearch(e) {
  outfitSearchValue = e.target.value.trim();
  if (!outfitSearchValue) {
    // Clear search, restore pagination
    outfitSearchValue = "";
    outfitPage = 1;
  }
  buildOutfitThumbnails();
}

function changeOutfitPage(direction) {
  if (outfitSearchValue) return; // Can't paginate when searching
  
  const totalPages = Math.ceil(OUTFIT_COUNT / OUTFIT_PER_PAGE);
  outfitPage += direction;
  
  if (outfitPage < 1) outfitPage = 1;
  if (outfitPage > totalPages) outfitPage = totalPages;
  
  buildOutfitThumbnails();
}

function updateOutfitPagination() {
  if (outfitSearchValue) {
    outfitPageInfo.textContent = "Search Mode";
    outfitPrev.disabled = true;
    outfitNext.disabled = true;
    return;
  }
  
  const totalPages = Math.ceil(OUTFIT_COUNT / OUTFIT_PER_PAGE);
  outfitPageInfo.textContent = `Page ${outfitPage} of ${totalPages}`;
  outfitPrev.disabled = outfitPage === 1;
  outfitNext.disabled = outfitPage === totalPages;
}
