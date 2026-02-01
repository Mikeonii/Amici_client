<template>
  <div>
    <v-btn @click="openModal" color="red darken-1" dark>
      <v-icon left>mdi-trophy</v-icon>
      Monthly Top Gym-Goers
    </v-btn>
    <v-dialog v-model="dialog" width="1100" persistent>
      <v-card>
        <v-card-title class="headline red darken-2 white--text">
          <v-icon left color="white">mdi-trophy</v-icon>
          Top Monthly Gym-Goers & Rewards
        </v-card-title>
        <v-card-text class="pt-4">
          <!-- Month/Year Selection -->
          <v-row align="center">
            <v-col cols="3">
              <v-select
                :items="months"
                item-text="name"
                item-value="value"
                label="Month"
                v-model="selectedMonth"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-select
                :items="[2024, 2025, 2026, 2027]"
                label="Year"
                v-model="selectedYear"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-btn color="red darken-1" dark @click="search" :loading="searchLoading">
                <v-icon left>mdi-magnify</v-icon>
                Search
              </v-btn>
            </v-col>
          </v-row>

          <!-- Reward Days Configuration -->
          <v-card outlined class="mb-4 pa-3">
            <h4 class="mb-3">Reward Days Configuration</h4>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model.number="rewardDays.rankA"
                  label="Top 1-3 (Rank A)"
                  type="number"
                  prepend-icon="mdi-medal"
                  outlined
                  dense
                  suffix="days"
                  color="red darken-1"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model.number="rewardDays.rankB"
                  label="Top 4-6 (Rank B)"
                  type="number"
                  prepend-icon="mdi-medal"
                  outlined
                  dense
                  suffix="days"
                  color="grey darken-1"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model.number="rewardDays.rankC"
                  label="Top 7-10 (Rank C)"
                  type="number"
                  prepend-icon="mdi-medal"
                  outlined
                  dense
                  suffix="days"
                  color="grey darken-3"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <!-- Top Gym Goers Table -->
          <v-data-table
            :items="topGymGoers"
            :headers="headers"
            :loading="searchLoading"
            class="elevation-1"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.position`]="{ index }">
              <v-chip
                :color="getPositionColor(index)"
                dark
                small
              >
                #{{ index + 1 }}
              </v-chip>
            </template>
            <template v-slot:[`item.profile`]="{ item }">
              <div class="pa-2">
                <v-avatar size="45" color="grey darken-3">
                  <h2
                    v-if="!item.profile_picture_url || item.profile_picture_url === 'n/a'"
                    class="white--text"
                  >
                    {{ item.name.charAt(0) }}
                  </h2>
                  <v-img
                    v-else
                    :src="item.profile_picture_url"
                  ></v-img>
                </v-avatar>
              </div>
            </template>
            <template v-slot:[`item.rank`]="{ item }">
              <v-chip :color="getRankInfo(item.rank).color" dark small>
                {{ item.rank }}
                <v-icon small right v-for="i in getRankInfo(item.rank).stars" :key="i">
                  mdi-star
                </v-icon>
              </v-chip>
            </template>
            <template v-slot:[`item.formatted_gym_time`]="{ item }">
              <span>{{ Math.floor(item.total_gym_time / 60) }} hrs {{ item.total_gym_time % 60 }} mins</span>
            </template>
            <template v-slot:[`item.reward_tier`]="{ index }">
              <v-chip
                :color="getRewardTierColor(index)"
                dark
                small
              >
                {{ getRewardTier(index) }} (+{{ getRewardDaysForPosition(index) }} days)
              </v-chip>
            </template>
          </v-data-table>

          <!-- Empty State -->
          <v-alert
            v-if="topGymGoers.length === 0 && !searchLoading && hasSearched"
            type="info"
            class="mt-4"
          >
            No gym goers found for the selected month and year.
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-btn
            color="red darken-1"
            dark
            @click="assignRewards"
            :loading="assignLoading"
            :disabled="topGymGoers.length === 0"
          >
            <v-icon left>mdi-gift</v-icon>
            Assign Rewards to All
          </v-btn>
          <v-btn
            color="grey darken-3"
            dark
            @click="generateLeaderboard"
            :loading="generateLoading"
            :disabled="topGymGoers.length === 0"
          >
            <v-icon left>mdi-image</v-icon>
            Generate Leaderboard
          </v-btn>
          <v-btn
            color="grey darken-1"
            dark
            @click="generateCertificates"
            :loading="certificateLoading"
            :disabled="topGymGoers.length === 0"
          >
            <v-icon left>mdi-certificate</v-icon>
            Generate Certificates
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" text>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Leaderboard Preview Dialog -->
    <v-dialog v-model="leaderboardDialog" width="1000">
      <v-card>
        <v-card-title class="red darken-2 white--text">Generated Leaderboard</v-card-title>
        <v-card-text class="text-center pa-4">
          <v-img
            v-if="leaderboardImage"
            :src="leaderboardImage"
            contain
            max-height="700"
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" dark @click="downloadLeaderboard">
            <v-icon left>mdi-download</v-icon>
            Download Image
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="leaderboardDialog = false" text>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Certificates Preview Dialog -->
    <v-dialog v-model="certificateDialog" width="1000">
      <v-card>
        <v-card-title class="red darken-2 white--text">Generated Certificates</v-card-title>
        <v-card-text class="pa-4">
          <v-carousel
            v-if="generatedCertificates.length > 0"
            height="550"
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(cert, index) in generatedCertificates"
              :key="index"
            >
              <v-img :src="cert.dataUrl" contain height="450"></v-img>
              <div class="text-center mt-2">
                <v-btn color="red darken-1" dark @click="downloadCertificate(cert)">
                  <v-icon left>mdi-download</v-icon>
                  Download #{{ cert.position }} - {{ cert.name }}
                </v-btn>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey darken-3" dark @click="downloadAllCertificates">
            <v-icon left>mdi-download-multiple</v-icon>
            Download All
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="certificateDialog = false" text>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      months: [
        { name: "January", value: 1 },
        { name: "February", value: 2 },
        { name: "March", value: 3 },
        { name: "April", value: 4 },
        { name: "May", value: 5 },
        { name: "June", value: 6 },
        { name: "July", value: 7 },
        { name: "August", value: 8 },
        { name: "September", value: 9 },
        { name: "October", value: 10 },
        { name: "November", value: 11 },
        { name: "December", value: 12 },
      ],
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      dialog: false,
      searchLoading: false,
      assignLoading: false,
      generateLoading: false,
      certificateLoading: false,
      hasSearched: false,
      topGymGoers: [],
      rewardDays: {
        rankA: 10,
        rankB: 5,
        rankC: 3,
      },
      headers: [
        { text: "Position", value: "position", sortable: false, width: "80px" },
        { text: "", value: "profile", sortable: false, width: "70px" },
        { text: "Name", value: "name" },
        { text: "Rank", value: "rank", sortable: false },
        { text: "Attendance", value: "attendances_count" },
        { text: "Total Gym Time", value: "formatted_gym_time", sortable: false },
        { text: "Reward Tier", value: "reward_tier", sortable: false },
      ],
      leaderboardDialog: false,
      leaderboardImage: null,
      certificateDialog: false,
      generatedCertificates: [],
      bgImage: null,
      logoImage: null,
      imagesLoaded: false,
    };
  },
  methods: {
    async openModal() {
      this.dialog = true;
      await this.search();
    },

    getRankInfo(rank) {
      const ranks = {
        Novice: { color: "grey", stars: 1 },
        Lifter: { color: "grey darken-1", stars: 2 },
        Veteran: { color: "grey darken-2", stars: 3 },
        Master: { color: "red lighten-1", stars: 4 },
        Legendary: { color: "red darken-1", stars: 5 },
        Beast: { color: "red darken-3", stars: 6 },
      };
      return ranks[rank] || { color: "grey", stars: 1 };
    },

    getPositionColor(index) {
      if (index === 0) return "red darken-1";
      if (index === 1) return "grey darken-1";
      if (index === 2) return "grey darken-3";
      return "grey";
    },

    getRewardTier(index) {
      if (index < 3) return "Rank A";
      if (index < 6) return "Rank B";
      return "Rank C";
    },

    getRewardTierColor(index) {
      if (index < 3) return "red darken-1";
      if (index < 6) return "grey darken-1";
      return "grey darken-3";
    },

    getRewardDaysForPosition(index) {
      if (index < 3) return this.rewardDays.rankA;
      if (index < 6) return this.rewardDays.rankB;
      return this.rewardDays.rankC;
    },

    async search() {
      this.searchLoading = true;
      this.hasSearched = true;
      try {
        const response = await axios.get(
          `/get_top_gymmer_of_the_month/${this.selectedMonth}/${this.selectedYear}`
        );
        this.topGymGoers = response.data;
      } catch (error) {
        console.error("Error fetching top gym goers:", error);
        alert("Error fetching data: " + error.message);
      } finally {
        this.searchLoading = false;
      }
    },

    async assignRewards() {
      if (this.topGymGoers.length === 0) {
        alert("No gym goers to assign rewards to.");
        return;
      }

      const monthName = this.months.find(m => m.value === this.selectedMonth)?.name;
      const confirmMessage = `Are you sure you want to assign rewards to all ${this.topGymGoers.length} top gym goers for ${monthName} ${this.selectedYear}?\n\nThis will add days to their monthly expiration:\n- Top 1-3: +${this.rewardDays.rankA} days\n- Top 4-6: +${this.rewardDays.rankB} days\n- Top 7-10: +${this.rewardDays.rankC} days`;

      if (!confirm(confirmMessage)) {
        return;
      }

      this.assignLoading = true;
      try {
        // Split gym goers into rank groups (A: 1-3, B: 4-6, C: 7-10)
        const selectedRankA = this.topGymGoers.slice(0, 3).map(g => ({ id: g.id, name: g.name }));
        const selectedRankB = this.topGymGoers.slice(3, 6).map(g => ({ id: g.id, name: g.name }));
        const selectedRankC = this.topGymGoers.slice(6, 10).map(g => ({ id: g.id, name: g.name }));

        const payload = {
          month: this.months.find(m => m.value === this.selectedMonth)?.name,
          year: this.selectedYear,
          selectedRankA,
          selectedRankB,
          selectedRankC,
          rankA: this.rewardDays.rankA,
          rankB: this.rewardDays.rankB,
          rankC: this.rewardDays.rankC,
        };

        await axios.post("/assign_rewards", payload);
        alert("Rewards assigned successfully!");
      } catch (error) {
        console.error("Error assigning rewards:", error);
        alert("Error assigning rewards: " + (error.response?.data?.message || error.message));
      } finally {
        this.assignLoading = false;
      }
    },

    loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        img.src = src;
      });
    },

    getApiBaseUrl() {
      // Get the API base URL from axios defaults or environment
      const baseURL = axios.defaults.baseURL || '';
      // Remove /api suffix if present to get server root
      return baseURL.replace(/\/api\/?$/, '');
    },

    async loadAssets() {
      if (this.imagesLoaded) return;

      try {
        // Fetch images as base64 from API to avoid CORS issues
        const response = await axios.get("/get_gym_assets");
        const assets = response.data;

        if (assets.logo) {
          this.logoImage = await this.loadImage(assets.logo);
          console.log("Logo loaded from API (base64)");
        }

        if (assets.background) {
          this.bgImage = await this.loadImage(assets.background);
          console.log("Background loaded from API (base64)");
        }

        this.imagesLoaded = true;
      } catch (error) {
        console.error("Failed to load assets from API:", error);
        // Fallback: try direct paths
        const baseUrl = this.getApiBaseUrl();
        const paths = [
          { type: 'logo', url: `${baseUrl}/storage/AlphaLogo.jpg` },
          { type: 'bg', url: `${baseUrl}/storage/AlphaBackground.jpg` },
        ];

        for (const path of paths) {
          try {
            if (path.type === 'logo') {
              this.logoImage = await this.loadImage(path.url);
            } else {
              this.bgImage = await this.loadImage(path.url);
            }
          } catch (e) {
            console.log(`Failed to load ${path.type} from:`, path.url);
          }
        }
        this.imagesLoaded = true;
      }
    },

    async generateLeaderboard() {
      if (this.topGymGoers.length === 0) {
        alert("No gym goers to generate leaderboard for.");
        return;
      }

      this.generateLoading = true;

      try {
        await this.loadAssets();
        const monthName = this.months.find(m => m.value === this.selectedMonth)?.name;
        this.leaderboardImage = this.drawLeaderboard(monthName);
        this.leaderboardDialog = true;
      } catch (error) {
        console.error("Error generating leaderboard:", error);
        alert("Error generating leaderboard: " + error.message);
      } finally {
        this.generateLoading = false;
      }
    },

    drawLeaderboard(monthName) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 1080;
      canvas.height = 1350;

      // Dark gradient background (no image)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1a1a1a");
      gradient.addColorStop(0.5, "#2d2d2d");
      gradient.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Red accent bar at top
      ctx.fillStyle = "#CC0000";
      ctx.fillRect(0, 0, canvas.width, 8);

      // Header section with logo
      const headerY = 60;

      // Draw logo
      if (this.logoImage) {
        const logoSize = 100;
        // Draw circular logo
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, headerY + 50, logoSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.logoImage, canvas.width / 2 - logoSize / 2, headerY, logoSize, logoSize);
        ctx.restore();

        // Red border around logo
        ctx.beginPath();
        ctx.arc(canvas.width / 2, headerY + 50, logoSize / 2 + 4, 0, Math.PI * 2);
        ctx.strokeStyle = "#CC0000";
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      // Gym name
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ALPHA FITNESS GYM", canvas.width / 2, headerY + 140);

      // Location
      ctx.fillStyle = "#AAAAAA";
      ctx.font = "16px Arial, sans-serif";
      ctx.fillText("Cantilan, Surigao del Sur", canvas.width / 2, headerY + 165);

      // Month and Year - Large title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 72px Impact, sans-serif";
      ctx.fillText(monthName.toUpperCase(), canvas.width / 2, headerY + 250);
      ctx.fillText(this.selectedYear.toString(), canvas.width / 2, headerY + 320);

      // Decorative line
      ctx.strokeStyle = "#CC0000";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 150, headerY + 340);
      ctx.lineTo(canvas.width / 2 + 150, headerY + 340);
      ctx.stroke();

      // Subtitle
      ctx.fillStyle = "#CC0000";
      ctx.font = "bold 42px Impact, sans-serif";
      ctx.fillText("TOP 10 GYM-GOERS", canvas.width / 2, headerY + 390);

      // Leaderboard entries
      const startY = headerY + 440;
      const entryHeight = 75;
      const gymGoers = this.topGymGoers.slice(0, 10);

      gymGoers.forEach((gymmer, index) => {
        const y = startY + (index * entryHeight);
        const isTopThree = index < 3;

        // Entry background
        if (isTopThree) {
          // Gradient background for top 3
          const grad = ctx.createLinearGradient(80, y, canvas.width - 80, y);
          if (index === 0) {
            grad.addColorStop(0, "rgba(204, 0, 0, 0.4)");
            grad.addColorStop(1, "rgba(204, 0, 0, 0.1)");
          } else {
            grad.addColorStop(0, "rgba(100, 100, 100, 0.4)");
            grad.addColorStop(1, "rgba(100, 100, 100, 0.1)");
          }
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        }

        // Rounded rectangle background
        this.roundRect(ctx, 80, y, canvas.width - 160, entryHeight - 8, 10);
        ctx.fill();

        // Position number with circle
        const posX = 130;
        ctx.beginPath();
        ctx.arc(posX, y + (entryHeight - 8) / 2, 25, 0, Math.PI * 2);
        ctx.fillStyle = index === 0 ? "#CC0000" : index < 3 ? "#666666" : "#444444";
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${index + 1}`, posX, y + (entryHeight - 8) / 2 + 7);

        // Avatar circle
        const avatarX = 200;
        const avatarY_center = y + (entryHeight - 8) / 2;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY_center, 22, 0, Math.PI * 2);
        ctx.fillStyle = "#333333";
        ctx.fill();
        ctx.strokeStyle = isTopThree ? "#CC0000" : "#666666";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(gymmer.name.charAt(0).toUpperCase(), avatarX, avatarY_center + 6);

        // Name
        ctx.fillStyle = "#FFFFFF";
        ctx.font = isTopThree ? "bold 20px Arial, sans-serif" : "18px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(gymmer.name.toUpperCase(), 245, y + 28);

        // Rank with stars
        ctx.fillStyle = this.getRankColorForCanvas(gymmer.rank);
        ctx.font = "bold 14px Arial, sans-serif";
        const rankText = gymmer.rank.toUpperCase();
        ctx.fillText(rankText, 245, y + 52);

        // Stars
        const rankInfo = this.getRankInfo(gymmer.rank);
        ctx.fillStyle = "#888888";
        const starsStartX = 245 + ctx.measureText(rankText).width + 8;
        for (let s = 0; s < rankInfo.stars; s++) {
          ctx.fillText("★", starsStartX + (s * 15), y + 52);
        }

        // Stats on the right
        ctx.textAlign = "right";

        // Attendance
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px Arial, sans-serif";
        ctx.fillText(`${gymmer.attendances_count}`, canvas.width - 200, y + 32);
        ctx.fillStyle = "#888888";
        ctx.font = "12px Arial, sans-serif";
        ctx.fillText("ATTENDANCE", canvas.width - 200, y + 50);

        // Gym time
        const hours = Math.floor(gymmer.total_gym_time / 60);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px Arial, sans-serif";
        ctx.fillText(`${hours}`, canvas.width - 100, y + 32);
        ctx.fillStyle = "#888888";
        ctx.font = "12px Arial, sans-serif";
        ctx.fillText("HOURS", canvas.width - 100, y + 50);
      });

      // Footer
      ctx.fillStyle = "#CC0000";
      ctx.fillRect(0, canvas.height - 8, canvas.width, 8);

      ctx.fillStyle = "#888888";
      ctx.font = "14px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("www.facebook.com/alphafitnessgymcantilan", canvas.width / 2, canvas.height - 30);

      return canvas.toDataURL("image/png");
    },

    roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },

    getRankColorForCanvas(rank) {
      const colors = {
        Novice: "#888888",
        Lifter: "#777777",
        Veteran: "#666666",
        Master: "#CC0000",
        Legendary: "#AA0000",
        Beast: "#880000",
      };
      return colors[rank] || "#888888";
    },

    async generateCertificates() {
      if (this.topGymGoers.length === 0) {
        alert("No gym goers to generate certificates for.");
        return;
      }

      this.certificateLoading = true;
      this.generatedCertificates = [];

      try {
        await this.loadAssets();
        const monthName = this.months.find(m => m.value === this.selectedMonth)?.name;

        for (let i = 0; i < Math.min(this.topGymGoers.length, 10); i++) {
          const gymmer = this.topGymGoers[i];
          const certDataUrl = this.drawCertificate(gymmer, i + 1, monthName);
          this.generatedCertificates.push({
            name: gymmer.name,
            dataUrl: certDataUrl,
            position: i + 1,
          });
        }

        this.certificateDialog = true;
      } catch (error) {
        console.error("Error generating certificates:", error);
        alert("Error generating certificates: " + error.message);
      } finally {
        this.certificateLoading = false;
      }
    },

    drawCertificate(gymmer, position, monthName) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Landscape orientation
      canvas.width = 1200;
      canvas.height = 850;

      // Dark gradient background (no image)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1a1a1a");
      gradient.addColorStop(0.5, "#2d2d2d");
      gradient.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Red accent bars
      ctx.fillStyle = "#CC0000";
      ctx.fillRect(0, 0, canvas.width, 8);
      ctx.fillRect(0, canvas.height - 8, canvas.width, 8);

      // Left side red accent
      ctx.fillRect(0, 0, 8, canvas.height);

      // Right side red accent
      ctx.fillRect(canvas.width - 8, 0, 8, canvas.height);

      const isTopThree = position <= 3;

      // Left section - Logo and Position
      const leftCenterX = 200;

      // Draw logo
      if (this.logoImage) {
        const logoSize = 100;
        ctx.save();
        ctx.beginPath();
        ctx.arc(leftCenterX, 120, logoSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.logoImage, leftCenterX - logoSize / 2, 70, logoSize, logoSize);
        ctx.restore();

        // Red border around logo
        ctx.beginPath();
        ctx.arc(leftCenterX, 120, logoSize / 2 + 4, 0, Math.PI * 2);
        ctx.strokeStyle = "#CC0000";
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      // Gym name under logo
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ALPHA FITNESS GYM", leftCenterX, 200);

      ctx.fillStyle = "#888888";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("Cantilan, Surigao del Sur", leftCenterX, 220);

      // Position badge - large circle
      const badgeY = 420;
      ctx.beginPath();
      ctx.arc(leftCenterX, badgeY, 90, 0, Math.PI * 2);
      ctx.fillStyle = position === 1 ? "#CC0000" : isTopThree ? "#555555" : "#333333";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Position number
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 80px Impact, sans-serif";
      ctx.fillText(`#${position}`, leftCenterX, badgeY + 28);

      // Position text
      ctx.fillStyle = "#AAAAAA";
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillText(this.getPositionText(position), leftCenterX, badgeY + 130);

      // Main content - Right side
      const rightCenterX = 720;

      // Certificate Title
      ctx.fillStyle = "#CC0000";
      ctx.font = "bold 52px Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CERTIFICATE", rightCenterX, 100);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 36px Impact, sans-serif";
      ctx.fillText("OF ACHIEVEMENT", rightCenterX, 145);

      // Decorative line
      ctx.strokeStyle = "#CC0000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rightCenterX - 200, 170);
      ctx.lineTo(rightCenterX + 200, 170);
      ctx.stroke();

      // Presented to text
      ctx.fillStyle = "#888888";
      ctx.font = "20px Arial, sans-serif";
      ctx.fillText("This certificate is proudly presented to", rightCenterX, 220);

      // Name with background card - BIGGER NAME
      const nameY = 300;
      this.roundRect(ctx, 370, nameY - 50, 700, 100, 15);
      ctx.fillStyle = "rgba(204, 0, 0, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "#CC0000";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 56px Arial, sans-serif";
      ctx.fillText(gymmer.name.toUpperCase(), rightCenterX, nameY + 18);

      // Rank with stars (below the name)
      const rankInfo = this.getRankInfo(gymmer.rank);
      const stars = "★".repeat(rankInfo.stars);
      ctx.fillStyle = this.getRankColorForCanvas(gymmer.rank);
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillText(`${gymmer.rank.toUpperCase()} ${stars}`, rightCenterX, nameY + 70);

      // Month and Year
      ctx.fillStyle = "#AAAAAA";
      ctx.font = "22px Arial, sans-serif";
      ctx.fillText("For being the", rightCenterX, 420);

      ctx.fillStyle = "#CC0000";
      ctx.font = "bold 42px Impact, sans-serif";
      ctx.fillText(`TOP GYM GOER OF ${monthName.toUpperCase()} ${this.selectedYear}`, rightCenterX, 470);

      // Stats section
      const statsY = 510;

      // Stats background
      this.roundRect(ctx, 420, statsY, 600, 80, 10);
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fill();

      // Attendance stat
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px Arial, sans-serif";
      ctx.fillText(`${gymmer.attendances_count}`, rightCenterX - 120, statsY + 40);
      ctx.fillStyle = "#888888";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("ATTENDANCE", rightCenterX - 120, statsY + 60);

      // Gym time stat
      const hours = Math.floor(gymmer.total_gym_time / 60);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px Arial, sans-serif";
      ctx.fillText(`${hours}`, rightCenterX + 120, statsY + 40);
      ctx.fillStyle = "#888888";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("HOURS", rightCenterX + 120, statsY + 60);

      // Divider
      ctx.strokeStyle = "#444444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rightCenterX, statsY + 15);
      ctx.lineTo(rightCenterX, statsY + 65);
      ctx.stroke();

      // Expiration dates section
      const rewardDays = this.getRewardDaysForPosition(position - 1);
      const currentExpiry = gymmer.expiry_date || "N/A";

      // Calculate new expiry date
      let newExpiry = "N/A";
      if (gymmer.expiry_date && gymmer.expiry_date !== "N/A") {
        try {
          const expiryDate = new Date(gymmer.expiry_date);
          expiryDate.setDate(expiryDate.getDate() + rewardDays);
          newExpiry = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
          newExpiry = "N/A";
        }
      }

      // Expiry dates background
      const expiryY = 610;
      this.roundRect(ctx, 420, expiryY, 600, 90, 10);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fill();

      // Current expiry
      ctx.fillStyle = "#888888";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("CURRENT EXPIRY", rightCenterX - 120, expiryY + 25);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px Arial, sans-serif";
      ctx.fillText(currentExpiry, rightCenterX - 120, expiryY + 50);

      // Arrow
      ctx.fillStyle = "#CC0000";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillText("→", rightCenterX, expiryY + 45);

      // New expiry
      ctx.fillStyle = "#888888";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("NEW EXPIRY", rightCenterX + 120, expiryY + 25);
      ctx.fillStyle = "#00CC00";
      ctx.font = "bold 18px Arial, sans-serif";
      ctx.fillText(newExpiry, rightCenterX + 120, expiryY + 50);

      // Reward days added
      ctx.fillStyle = "#CC0000";
      ctx.font = "bold 16px Arial, sans-serif";
      ctx.fillText(`+${rewardDays} DAYS REWARD`, rightCenterX, expiryY + 80);

      // Footer
      ctx.fillStyle = "#666666";
      ctx.font = "14px Arial, sans-serif";
      ctx.fillText("www.facebook.com/alphafitnessgymcantilan", rightCenterX, 760);

      return canvas.toDataURL("image/png");
    },

    getPositionText(position) {
      if (position === 1) return "1ST PLACE";
      if (position === 2) return "2ND PLACE";
      if (position === 3) return "3RD PLACE";
      return `${position}TH PLACE`;
    },

    downloadLeaderboard() {
      const monthName = this.months.find(m => m.value === this.selectedMonth)?.name;
      const link = document.createElement("a");
      link.download = `top_gym_goers_${monthName}_${this.selectedYear}.png`;
      link.href = this.leaderboardImage;
      link.click();
    },

    downloadCertificate(cert) {
      const link = document.createElement("a");
      link.download = `certificate_${cert.position}_${cert.name.replace(/\s+/g, "_")}.png`;
      link.href = cert.dataUrl;
      link.click();
    },

    downloadAllCertificates() {
      this.generatedCertificates.forEach((cert, index) => {
        setTimeout(() => {
          this.downloadCertificate(cert);
        }, index * 300);
      });
    },
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
