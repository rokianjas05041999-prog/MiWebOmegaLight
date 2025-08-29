// Team Component
// Handles team section functionality and interactions

import { DOMUtils } from '../utils/dom.js';

export class Team {
  constructor() {
    this.teamMembers = [];
    this.currentFilter = 'all';
    this.animationObserver = null;
    
    this.init();
  }

  init() {
    this.setupTeamData();
    this.enhanceTeamSection();
    this.setupEventListeners();
    this.setupAnimations();
  }

  setupTeamData() {
    // Team members data - matches team section
    this.teamMembers = [
      {
        id: 'ahmad-expert',
        name: 'team.members.member1.name',
        position: 'team.members.member1.position',
        experience: 'team.members.member1.experience',
        description: 'team.members.member1.description',
        specialties: ['team.members.member1.specialty1', 'team.members.member1.specialty2'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        email: 'ahmad@omegalight.co.id',
        phone: '+62 812-3456-7890',
        linkedin: '#',
        category: 'engineer'
      },
      {
        id: 'sari-engineer',
        name: 'team.members.member2.name',
        position: 'team.members.member2.position',
        experience: 'team.members.member2.experience',
        description: 'team.members.member2.description',
        specialties: ['team.members.member2.specialty1', 'team.members.member2.specialty2'],
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        email: 'sari@omegalight.co.id',
        phone: '+62 856-7890-1234',
        linkedin: '#',
        category: 'specialist'
      },
      {
        id: 'budi-technician',
        name: 'team.members.member3.name',
        position: 'team.members.member3.position',
        experience: 'team.members.member3.experience',
        description: 'team.members.member3.description',
        specialties: ['team.members.member3.specialty1', 'team.members.member3.specialty2'],
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        email: 'budi@omegalight.co.id',
        phone: '+62 821-9876-5432',
        linkedin: '#',
        category: 'specialist'
      },
      {
        id: 'andi-manager',
        name: 'team.members.member4.name',
        position: 'team.members.member4.position',
        experience: 'team.members.member4.experience',
        description: 'team.members.member4.description',
        specialties: ['team.members.member4.specialty1', 'team.members.member4.specialty2'],
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
        email: 'andi@omegalight.co.id',
        phone: '+62 813-2468-1357',
        linkedin: '#',
        category: 'manager'
      }
    ];
  }

  enhanceTeamSection() {
    const teamSection = DOMUtils.select('#team, .team-section');
    if (!teamSection) return;

    // Add filter functionality if not exists
    this.addFilterButtons(teamSection);
    
    // Enhance team cards with additional functionality
    this.enhanceTeamCards();
  }

  addFilterButtons(teamSection) {
    const teamHeader = teamSection.querySelector('.team-header');
    if (!teamHeader || teamHeader.querySelector('.team-filters')) return;

    const filtersHTML = `
      <div class="team-filters">
        <button class="team-filter-btn active" data-filter="all" data-translate="team.filters.all">
          Semua Tim
        </button>
        <button class="team-filter-btn" data-filter="engineer" data-translate="team.filters.engineer">
          Engineer
        </button>
        <button class="team-filter-btn" data-filter="specialist" data-translate="team.filters.specialist">
          Specialist
        </button>
        <button class="team-filter-btn" data-filter="manager" data-translate="team.filters.manager">
          Manager
        </button>
      </div>
    `;

    teamHeader.insertAdjacentHTML('beforeend', filtersHTML);
  }

  enhanceTeamCards() {
    const teamCards = DOMUtils.selectAll('.team-card');
    
    teamCards.forEach((card, index) => {
      // Add data attributes for filtering
      if (this.teamMembers[index]) {
        card.setAttribute('data-category', this.teamMembers[index].category);
        card.setAttribute('data-member-id', this.teamMembers[index].id);
      }

      // Add click handler for member details
      DOMUtils.addEventListener(card, 'click', (e) => {
        // Don't trigger if clicking on social links
        if (e.target.closest('.team-social-link')) return;
        
        this.showMemberDetails(this.teamMembers[index]);
      });

      // Enhance social links
      const socialLinks = card.querySelectorAll('.team-social-link');
      socialLinks.forEach((link, linkIndex) => {
        const member = this.teamMembers[index];
        if (!member) return;

        const icons = ['heroicons:envelope', 'heroicons:phone', 'simple-icons:linkedin'];
        const actions = [
          () => window.location.href = `mailto:${member.email}`,
          () => window.location.href = `tel:${member.phone}`,
          () => window.open(member.linkedin, '_blank')
        ];

        if (actions[linkIndex]) {
          DOMUtils.addEventListener(link, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            actions[linkIndex]();
          });
        }
      });
    });
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = DOMUtils.selectAll('.team-filter-btn');
    filterButtons.forEach(button => {
      DOMUtils.addEventListener(button, 'click', () => {
        const filter = button.dataset.filter;
        this.filterTeamMembers(filter);
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    // Team stats counter animation
    this.setupStatsAnimation();
  }

  setupStatsAnimation() {
    const statsNumbers = DOMUtils.selectAll('.team-stat-number');
    
    const animateCounter = (element, target) => {
      const duration = 2000; // 2 seconds
      const start = 0;
      const increment = target / (duration / 16); // 60fps
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        // Format number based on content
        let displayValue = Math.floor(current);
        if (element.textContent.includes('+')) {
          displayValue = displayValue + '+';
        } else if (element.textContent.includes('%')) {
          displayValue = displayValue + '%';
        }
        
        element.textContent = displayValue;
      }, 16);
    };

    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const text = element.textContent;
          const number = parseInt(text.replace(/[^\d]/g, ''));
          
          if (number && !element.dataset.animated) {
            element.dataset.animated = 'true';
            animateCounter(element, number);
          }
        }
      });
    }, { threshold: 0.5 });

    statsNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });
  }

  setupAnimations() {
    // Intersection Observer for card animations
    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe team cards
    const teamCards = DOMUtils.selectAll('.team-card');
    teamCards.forEach(card => {
      this.animationObserver.observe(card);
    });
  }

  filterTeamMembers(filter) {
    this.currentFilter = filter;
    const teamCards = DOMUtils.selectAll('.team-card');
    
    teamCards.forEach(card => {
      const category = card.dataset.category;
      
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
        card.classList.add('filter-show');
        card.classList.remove('filter-hide');
      } else {
        card.classList.add('filter-hide');
        card.classList.remove('filter-show');
        
        // Hide after animation
        setTimeout(() => {
          if (card.classList.contains('filter-hide')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  }

  showMemberDetails(member) {
    if (!member) return;

    // Create modal or redirect to detail page
    const detailUrl = `detail-team.html?id=${member.id}`;
    window.location.href = detailUrl;
  }

  // Method to get member by ID (useful for detail pages)
  getMemberById(id) {
    return this.teamMembers.find(member => member.id === id);
  }

  // Method to get members by category
  getMembersByCategory(category) {
    if (category === 'all') return this.teamMembers;
    return this.teamMembers.filter(member => member.category === category);
  }

  // Method to search members
  searchMembers(query) {
    const searchTerm = query.toLowerCase();
    return this.teamMembers.filter(member => 
      member.name.toLowerCase().includes(searchTerm) ||
      member.position.toLowerCase().includes(searchTerm) ||
      member.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm)
      )
    );
  }

  destroy() {
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
  }
}

export default Team;