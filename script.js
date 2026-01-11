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

// Get export buttons and toast element
const exportBtn = document.getElementById("exportBtn");
const mobileExportBtn = document.getElementById("mobileExportBtn");
const exportToast = document.getElementById("exportToast");

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
  
  // Setup export
  setupExport();
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

// Export PNG functionality
function setupExport() {
  exportBtn.addEventListener("click", handleExport);
  if (mobileExportBtn) {
    mobileExportBtn.addEventListener("click", handleExport);
  }
}

// Status message management
let statusTimeout = null;

function showExportStatus(message, type = "info") {
  // Clear existing timeout
  if (statusTimeout) {
    clearTimeout(statusTimeout);
  }
  
  // Update toast
  if (exportToast) {
    exportToast.textContent = message;
    exportToast.className = "export-toast";
    if (type === "success") {
      exportToast.classList.add("success");
    } else if (type === "error") {
      exportToast.classList.add("error");
    }
    // Trigger show animation
    setTimeout(() => {
      exportToast.classList.add("show");
    }, 10);
  }
  
  // Auto-hide after 2 seconds
  statusTimeout = setTimeout(() => {
    hideExportStatus();
  }, 2000);
}

function hideExportStatus() {
  if (exportToast) {
    exportToast.classList.remove("show");
    setTimeout(() => {
      exportToast.textContent = "";
      exportToast.className = "export-toast";
    }, 300);
  }
  
  if (statusTimeout) {
    clearTimeout(statusTimeout);
    statusTimeout = null;
  }
}

async function handleExport() {
  // Check if all images are loaded
  const images = [baseImg, hairImg, outfitImg];
  if (guitarIdx !== null && guitarImg.src) images.push(guitarImg);
  if (accIdx !== null && accImg.src) images.push(accImg);
  
  // Check if all required images are loaded
  const allLoaded = images.every(img => {
    if (!img.src) return false;
    return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
  });
  
  if (!allLoaded) {
    showExportStatus("Images are still loading. Please try again in a moment.", "error");
    return;
  }
  
  // Update button state
  exportBtn.disabled = true;
  if (mobileExportBtn) {
    mobileExportBtn.disabled = true;
  }
  
  // Show exporting status
  showExportStatus("Exporting...", "info");
  
  try {
    // Get base image dimensions
    const width = baseImg.naturalWidth;
    const height = baseImg.naturalHeight;
    
    // Create offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    
    // Draw base image
    ctx.drawImage(baseImg, 0, 0);
    
    // Draw hair
    if (hairImg.complete && hairImg.naturalWidth > 0) {
      ctx.drawImage(hairImg, 0, 0);
    }
    
    // Draw outfit
    if (outfitImg.complete && outfitImg.naturalWidth > 0) {
      ctx.drawImage(outfitImg, 0, 0);
    }
    
    // Draw guitar (if selected)
    if (guitarIdx !== null && guitarImg.complete && guitarImg.naturalWidth > 0 && guitarImg.src) {
      ctx.drawImage(guitarImg, 0, 0);
    }
    
    // Draw accessory (if selected)
    if (accIdx !== null && accImg.complete && accImg.naturalWidth > 0 && accImg.src) {
      ctx.drawImage(accImg, 0, 0);
    }
    
    // Add bottom-right signature watermark (clear but tasteful)
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    
    const signatureText = "© Aowu_x";
    const signatureSize = Math.max(18, Math.min(32, width / 25));
    ctx.font = `${signatureSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    
    // Calculate text width to ensure proper positioning
    const textMetrics = ctx.measureText(signatureText);
    const textWidth = textMetrics.width;
    
    // Position watermark with 6-8% offset from edges (using 7% as middle value)
    const offsetX = width * 0.07;
    const offsetY = height * 0.07;
    
    // Calculate position: ensure watermark stays within canvas bounds
    // textAlign is "right", so textX is the right edge of the text
    // We want the text to be offsetX pixels from the right edge
    const textX = width - offsetX;
    // Ensure text doesn't go outside left boundary
    const minX = textWidth;
    const finalX = Math.max(minX, textX);
    
    // textBaseline is "bottom", so textY is the bottom edge of the text
    // We want the text to be offsetY pixels from the bottom edge
    const textY = height - offsetY;
    // Ensure text doesn't go outside top boundary
    const minY = signatureSize;
    const finalY = Math.max(minY, textY);
    
    // Draw white stroke for readability
    ctx.strokeText(signatureText, finalX, finalY);
    // Draw black text
    ctx.fillText(signatureText, finalX, finalY);
    ctx.restore();
    
    // Export as PNG
    canvas.toBlob(function(blob) {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "miracle-jisok.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success status and re-enable buttons
        showExportStatus("Saved!", "success");
        exportBtn.disabled = false;
        if (mobileExportBtn) {
          mobileExportBtn.disabled = false;
        }
      } else {
        // Fallback to toDataURL
        const dataURL = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "miracle-jisok.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show success status and re-enable buttons
        showExportStatus("Saved!", "success");
        exportBtn.disabled = false;
        if (mobileExportBtn) {
          mobileExportBtn.disabled = false;
        }
      }
    }, "image/png");
    
  } catch (error) {
    console.error("Export error:", error);
    showExportStatus("Export failed. Please try again.", "error");
    exportBtn.disabled = false;
    if (mobileExportBtn) {
      mobileExportBtn.disabled = false;
    }
  }
}
