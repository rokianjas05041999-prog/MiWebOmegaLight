// DetailTeam Component
// Handles team member detail page functionality

import { DOMUtils } from '../utils/dom.js';

export class DetailTeam {
  constructor() {
    this.currentMember = null;
    this.teamMembers = [];
    this.memberId = null;
    this.languageManager = null;
    
    this.init();
  }

  init() {
    // Get language manager from global app instance
    this.languageManager = window.app?.getManager('languageManager');
    
    this.setupTeamData();
    this.getMemberIdFromURL();
    this.loadMemberData();
    this.setupEventListeners();
    this.setupLanguageEventListeners();
    this.setupShareFunctionality();
  }

  setupTeamData() {
    // Team members data using translation keys for multilingual support
    this.teamMembers = [
      {
        id: 'ahmad-expert',
        nameKey: 'detailTeam.member.name',
        positionKey: 'detailTeam.member.position',
        departmentKey: 'detailTeam.meta.department',
        experienceKey: 'detailTeam.meta.experience',
        statusKey: 'detailTeam.meta.status',
        locationKey: 'detailTeam.sidebar.quickInfo.location.value',
        excerptKey: 'detailTeam.member.excerpt',
        experienceYears: 15,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face',
        email: 'ahmad@omegalight.co.id',
        phone: '+62 812-3456-7890',
        linkedin: '#',
        about: {
          text1Key: 'detailTeam.sections.about.text1',
          text2Key: 'detailTeam.sections.about.text2'
        },
        specializations: [
          {
            titleKey: 'detailTeam.specializations.industrial.title',
            descriptionKey: 'detailTeam.specializations.industrial.description',
            icon: 'heroicons:cog-6-tooth'
          },
          {
            titleKey: 'detailTeam.specializations.panels.title',
            descriptionKey: 'detailTeam.specializations.panels.description',
            icon: 'heroicons:rectangle-group'
          },
          {
            titleKey: 'detailTeam.specializations.safety.title',
            descriptionKey: 'detailTeam.specializations.safety.description',
            icon: 'heroicons:shield-check'
          }
        ],
        timeline: [
          {
            dateKey: 'detailTeam.timeline.project1.date',
            titleKey: 'detailTeam.timeline.project1.title',
            descriptionKey: 'detailTeam.timeline.project1.description'
          },
          {
            dateKey: 'detailTeam.timeline.project2.date',
            titleKey: 'detailTeam.timeline.project2.title',
            descriptionKey: 'detailTeam.timeline.project2.description'
          },
          {
            dateKey: 'detailTeam.timeline.project3.date',
            titleKey: 'detailTeam.timeline.project3.title',
            descriptionKey: 'detailTeam.timeline.project3.description'
          }
        ],
        certifications: [
          {
            titleKey: 'detailTeam.certifications.license.title',
            descriptionKey: 'detailTeam.certifications.license.description',
            icon: 'heroicons:academic-cap'
          },
          {
            titleKey: 'detailTeam.certifications.safety.title',
            descriptionKey: 'detailTeam.certifications.safety.description',
            icon: 'heroicons:shield-check'
          },
          {
            titleKey: 'detailTeam.certifications.code.title',
            descriptionKey: 'detailTeam.certifications.code.description',
            icon: 'heroicons:document-check'
          }
        ],
        skills: [
          'detailTeam.sidebar.skills.skill1',
          'detailTeam.sidebar.skills.skill2',
          'detailTeam.sidebar.skills.skill3',
          'detailTeam.sidebar.skills.skill4',
          'detailTeam.sidebar.skills.skill5',
          'detailTeam.sidebar.skills.skill6'
        ]
      },
      {
        id: 'sari-engineer',
        nameKey: 'detailTeam.sidebar.related.member1.name',
        positionKey: 'detailTeam.sidebar.related.member1.position',
        departmentKey: 'archiveTeam.filters.departments.technical',
        experienceKey: 'archiveTeam.sampleMembers.sari.experience',
        statusKey: 'detailTeam.meta.status',
        locationKey: 'detailTeam.sidebar.quickInfo.location.value',
        excerptKey: 'archiveTeam.sampleMembers.sari.excerpt',
        experienceYears: 10,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face',
        email: 'sari@omegalight.co.id',
        phone: '+62 856-7890-1234',
        linkedin: '#'
      },
      {
        id: 'budi-technician',
        nameKey: 'detailTeam.sidebar.related.member2.name',
        positionKey: 'detailTeam.sidebar.related.member2.position',
        departmentKey: 'archiveTeam.filters.departments.technical',
        experienceKey: 'archiveTeam.sampleMembers.budi.experience',
        statusKey: 'archiveTeam.status.busy',
        locationKey: 'detailTeam.sidebar.quickInfo.location.value',
        excerptKey: 'archiveTeam.sampleMembers.budi.excerpt',
        experienceYears: 8,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face',
        email: 'budi@omegalight.co.id',
        phone: '+62 821-9876-5432',
        linkedin: '#'
      },
      {
        id: 'andi-manager',
        nameKey: 'archiveTeam.sampleMembers.andi.name',
        positionKey: 'archiveTeam.sampleMembers.andi.position',
        departmentKey: 'archiveTeam.filters.departments.management',
        experienceKey: 'archiveTeam.sampleMembers.andi.experience',
        statusKey: 'detailTeam.meta.status',
        locationKey: 'detailTeam.sidebar.quickInfo.location.value',
        excerptKey: 'archiveTeam.sampleMembers.andi.excerpt',
        experienceYears: 12,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop&crop=face',
        email: 'andi@omegalight.co.id',
        phone: '+62 813-2468-1357',
        linkedin: '#'
      }
    ];
  }

  getMemberIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    this.memberId = urlParams.get('id') || 'ahmad-expert'; // Default to ahmad-expert
  }

  loadMemberData() {
    this.currentMember = this.teamMembers.find(member => member.id === this.memberId);
    
    if (!this.currentMember) {
      // If member not found, redirect to team archive or show error
      console.warn('Team member not found:', this.memberId);
      this.currentMember = this.teamMembers[0]; // Fallback to first member
    }

    this.renderMemberData();
  }

  renderMemberData() {
    if (!this.currentMember) return;

    // Update page title
    const memberName = this.translate(this.currentMember.nameKey);
    document.title = `${memberName} - OmegaLight Team`;

    // Update meta information
    this.updateMetaInfo();
    
    // Update header content
    this.updateHeaderContent();
    
    // Update main content
    this.updateMainContent();
    
    // Update sidebar
    this.updateSidebar();
    
    // Update related team members
    this.updateRelatedMembers();
  }

  setupLanguageEventListeners() {
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.renderMemberData();
    });
  }

  updateMetaInfo() {
    const departmentElement = DOMUtils.select('.detail-team-department span');
    const experienceElement = DOMUtils.select('.detail-team-experience span');
    const statusElement = DOMUtils.select('.detail-team-status span');

    if (departmentElement) departmentElement.textContent = this.translate(this.currentMember.departmentKey);
    if (experienceElement) experienceElement.textContent = this.translate(this.currentMember.experienceKey);
    if (statusElement) statusElement.textContent = this.translate(this.currentMember.statusKey);
  }

  updateHeaderContent() {
    const nameElement = DOMUtils.select('.detail-team-name');
    const positionElement = DOMUtils.select('.detail-team-position');
    const excerptElement = DOMUtils.select('.detail-team-excerpt');
    const imageElement = DOMUtils.select('.detail-team-image');

    const memberName = this.translate(this.currentMember.nameKey);
    
    if (nameElement) nameElement.textContent = memberName;
    if (positionElement) positionElement.textContent = this.translate(this.currentMember.positionKey);
    if (excerptElement) excerptElement.textContent = this.translate(this.currentMember.excerptKey);
    if (imageElement) {
      imageElement.src = this.currentMember.image;
      imageElement.alt = memberName;
    }

    // Update action buttons
    this.updateActionButtons();
  }

  updateActionButtons() {
    const emailButtons = DOMUtils.selectAll('a[href^="mailto:"]');
    const phoneButtons = DOMUtils.selectAll('a[href^="tel:"]');

    emailButtons.forEach(button => {
      button.href = `mailto:${this.currentMember.email}`;
    });

    phoneButtons.forEach(button => {
      button.href = `tel:${this.currentMember.phone}`;
    });
  }

  updateMainContent() {
    // Update about section
    this.updateAboutSection();
    
    // Update specializations
    this.updateSpecializations();
    
    // Update timeline
    this.updateTimeline();
    
    // Update certifications
    this.updateCertifications();
  }

  updateAboutSection() {
    const aboutText1 = DOMUtils.select('.detail-team-section .detail-team-paragraph:first-of-type');
    const aboutText2 = DOMUtils.select('.detail-team-section .detail-team-paragraph:last-of-type');

    if (aboutText1 && this.currentMember.about) {
      aboutText1.textContent = this.translate(this.currentMember.about.text1Key);
    }
    if (aboutText2 && this.currentMember.about) {
      aboutText2.textContent = this.translate(this.currentMember.about.text2Key);
    }
  }

  updateSpecializations() {
    const specializationsContainer = DOMUtils.select('.detail-team-specializations');
    if (!specializationsContainer || !this.currentMember.specializations) return;

    specializationsContainer.innerHTML = this.currentMember.specializations.map(spec => `
      <div class="detail-team-specialization">
        <div class="detail-team-specialization-icon">
          <iconify-icon icon="${spec.icon}"></iconify-icon>
        </div>
        <div class="detail-team-specialization-content">
          <h3 class="detail-team-specialization-title">${this.translate(spec.titleKey)}</h3>
          <p class="detail-team-specialization-description">${this.translate(spec.descriptionKey)}</p>
        </div>
      </div>
    `).join('');
  }

  updateTimeline() {
    const timelineContainer = DOMUtils.select('.detail-team-timeline');
    if (!timelineContainer || !this.currentMember.timeline) return;

    timelineContainer.innerHTML = this.currentMember.timeline.map(item => `
      <div class="detail-team-timeline-item">
        <div class="detail-team-timeline-marker"></div>
        <div class="detail-team-timeline-content">
          <div class="detail-team-timeline-date">${this.translate(item.dateKey)}</div>
          <h3 class="detail-team-timeline-title">${this.translate(item.titleKey)}</h3>
          <p class="detail-team-timeline-description">${this.translate(item.descriptionKey)}</p>
        </div>
      </div>
    `).join('');
  }

  updateCertifications() {
    const certificationsContainer = DOMUtils.select('.detail-team-certifications');
    if (!certificationsContainer || !this.currentMember.certifications) return;

    certificationsContainer.innerHTML = this.currentMember.certifications.map(cert => `
      <div class="detail-team-certification">
        <iconify-icon icon="${cert.icon}" class="detail-team-certification-icon"></iconify-icon>
        <div class="detail-team-certification-content">
          <h3 class="detail-team-certification-title">${this.translate(cert.titleKey)}</h3>
          <p class="detail-team-certification-description">${this.translate(cert.descriptionKey)}</p>
        </div>
      </div>
    `).join('');
  }

  updateSidebar() {
    // Update quick info
    const departmentValue = DOMUtils.select('.detail-team-info-item:nth-child(1) .detail-team-info-value');
    const experienceValue = DOMUtils.select('.detail-team-info-item:nth-child(2) .detail-team-info-value');
    const statusValue = DOMUtils.select('.detail-team-info-item:nth-child(3) .detail-team-info-value');
    const locationValue = DOMUtils.select('.detail-team-info-item:nth-child(4) .detail-team-info-value');

    if (departmentValue) departmentValue.textContent = this.translate(this.currentMember.departmentKey);
    if (experienceValue) experienceValue.textContent = this.translate(this.currentMember.experienceKey);
    if (statusValue) {
      const statusText = this.translate(this.currentMember.statusKey);
      statusValue.textContent = statusText;
      statusValue.className = `detail-team-info-value detail-team-status-${statusText.toLowerCase().replace(' ', '-')}`;
    }
    if (locationValue) locationValue.textContent = this.translate(this.currentMember.locationKey);

    // Update contact info
    const emailValue = DOMUtils.select('.detail-team-contact-item:nth-child(1) .detail-team-contact-value');
    const phoneValue = DOMUtils.select('.detail-team-contact-item:nth-child(2) .detail-team-contact-value');

    if (emailValue) {
      emailValue.textContent = this.currentMember.email;
      emailValue.href = `mailto:${this.currentMember.email}`;
    }
    if (phoneValue) {
      phoneValue.textContent = this.currentMember.phone;
      phoneValue.href = `tel:${this.currentMember.phone}`;
    }

    // Update skills
    this.updateSkills();
  }

  updateSkills() {
    const skillsContainer = DOMUtils.select('.detail-team-skills');
    if (!skillsContainer || !this.currentMember.skills) return;

    skillsContainer.innerHTML = this.currentMember.skills.map(skillKey =>
      `<span class="detail-team-skill">${this.translate(skillKey)}</span>`
    ).join('');
  }

  updateRelatedMembers() {
    const relatedContainer = DOMUtils.select('.detail-team-related');
    if (!relatedContainer) return;

    // Get other team members (exclude current member)
    const otherMembers = this.teamMembers.filter(member => member.id !== this.currentMember.id).slice(0, 2);

    relatedContainer.innerHTML = otherMembers.map(member => {
      const memberName = this.translate(member.nameKey);
      return `
        <a href="detail-team.html?id=${member.id}" class="detail-team-related-item">
          <img src="${member.image}" alt="${memberName}" class="detail-team-related-image">
          <div class="detail-team-related-content">
            <h4 class="detail-team-related-name">${memberName}</h4>
            <p class="detail-team-related-position">${this.translate(member.positionKey)}</p>
          </div>
        </a>
      `;
    }).join('');
  }

  translate(key, fallback = '') {
    if (this.languageManager) {
      return this.languageManager.translate(key, fallback);
    }
    return fallback || key;
  }

  setupEventListeners() {
    // Handle related member clicks
    const relatedLinks = DOMUtils.selectAll('.detail-team-related-item');
    relatedLinks.forEach(link => {
      DOMUtils.addEventListener(link, 'click', (e) => {
        // Let the default navigation happen
        // The page will reload with new member data
      });
    });

    // Handle social media links
    const socialLinks = DOMUtils.selectAll('.detail-team-social-link');
    socialLinks.forEach((link, index) => {
      const actions = [
        () => window.location.href = `mailto:${this.currentMember.email}`,
        () => window.location.href = `tel:${this.currentMember.phone}`,
        () => window.open(this.currentMember.linkedin, '_blank')
      ];

      if (actions[index]) {
        DOMUtils.addEventListener(link, 'click', (e) => {
          e.preventDefault();
          actions[index]();
        });
      }
    });
  }

  setupShareFunctionality() {
    const shareButton = DOMUtils.select('[data-share-profile]');
    if (shareButton) {
      DOMUtils.addEventListener(shareButton, 'click', () => {
        this.shareProfile();
      });
    }
  }

  shareProfile() {
    const shareData = {
      title: `${this.currentMember.name} - OmegaLight Team`,
      text: `Meet ${this.currentMember.name}, ${this.currentMember.position} at OmegaLight`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.log('Error sharing:', err);
        this.fallbackShare();
      });
    } else {
      this.fallbackShare();
    }
  }

  fallbackShare() {
    // Copy URL to clipboard as fallback
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Show a temporary notification
      this.showNotification('Profile URL copied to clipboard!');
    }).catch(() => {
      console.log('Could not copy to clipboard');
    });
  }

  showNotification(message) {
    // Create and show a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Method to get member by ID (useful for external access)
  getMemberById(id) {
    return this.teamMembers.find(member => member.id === id);
  }
}

export default DetailTeam;