# Wireshark Sample Captures Lab & Study Portal

A comprehensive, categorized, and beautiful offline study lab featuring all sample packet captures from the official [Wireshark Foundation Wiki](https://gitlab.com/wireshark/wireshark/-/wikis/SampleCaptures).

Every capture has been downloaded, indexed, classified by **Mastery Level** (Beginner to Expert), and grouped by **Real-World Network Scenario / Situation**, complete with Wireshark display filters, study tips, and terminal analysis commands.

---

## 🌟 Highlights

- **623 Curated Captures** from the official `SampleCaptures` wiki page.
- **1,379 Total Capture Files** (1.1 GB) preserved in `captures/all_wiki_captures/` covering every protocol page.
- **4 Progressive Mastery Levels**:
  - 🟢 **Level 1: Beginner** — Core fundamentals (ARP, ICMP Ping, DHCP DORA, basic DNS, IPv4 fragmentation).
  - 🔵 **Level 2: Intermediate** — Application & transport protocols, TLS/SSL & SSH handshakes with decryption keys, SMB, VLANs, and OSPF.
  - 🟣 **Level 3: Advanced** — Enterprise core routing (BGP, MPLS), carrier telecom (GTP, Diameter), VoIP (SIP, RTP, AMR), and SAN storage (iSCSI, NFSv4).
  - 🔴 **Level 4: Expert** — Real-world malware outbreaks (Blaster, Sasser, Slammer), SYN flood DoS attacks, buffer overflows, PROTOS fuzzing, and industrial SCADA (Modbus, Siemens S7COMM).
- **11 Domain Situations**:
  - `01_network_fundamentals`
  - `02_web_and_internet`
  - `03_security_and_cryptography`
  - `04_troubleshooting_anomalies`
  - `05_voip_telecom_multimedia`
  - `06_enterprise_routing_switching`
  - `07_file_storage_enterprise`
  - `08_industrial_iot_wireless`
  - `09_cellular_telecom_core`
  - `10_hardware_and_specialized`
  - `11_wireshark_testing_fuzzing`
- **Interactive Web Study Portal (`index.html`)**:
  - **7 Guided Learning Tracks** (Network Fundamentals 101, Web Protocols & TLS Decryption, Cybersecurity Forensics, TCP Troubleshooting, VoIP Multimedia, Enterprise Routing, Industrial ICS/SCADA).
  - **Live Search & Multi-Filter**: Filter instantaneously by Level, Situation, Protocol, or Keyword.
  - **Card Grid & Table Views**: Easily switch between rich visual cards and dense spreadsheet-like view.
  - **Study Inspector Modal**: Shows step-by-step guidance on what to look for in Wireshark, recommended display filters with 1-click copy, and ready-to-run `wireshark` & `tshark` terminal commands.
  - **Wireshark Cheat Sheet**: Built-in reference for essential display filter operators and troubleshooting commands.
  - **100% Offline & Standalone**: Zero dependencies or runtime build tools required. Open `index.html` directly in your browser.

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser (No Server Needed)
Simply open `index.html` in your web browser:
```bash
xdg-open index.html
# or
firefox index.html
# or
google-chrome index.html
```

### Option 2: Run Local Web Server
Launch the lightweight Python HTTP server:
```bash
python3 start_server.py
```
Then visit: **`http://localhost:8000`**

---

## 📁 Directory Structure

```
Wireshark_Study/
├── index.html                   # Beautiful interactive Study Portal (standalone)
├── style.css                    # Modern responsive CSS (dark/light mode, glassmorphism)
├── app.js                       # Client-side filtering, searching, modal, and tracks
├── start_server.py              # Optional local Python HTTP server
├── README.md                    # This comprehensive documentation
├── captures/                    # All downloaded and organized capture files
│   ├── 01_network_fundamentals/
│   ├── 02_web_and_internet/
│   ├── 03_security_and_cryptography/
│   ├── 04_troubleshooting_anomalies/
│   ├── 05_voip_telecom_multimedia/
│   ├── 06_enterprise_routing_switching/
│   ├── 07_file_storage_enterprise/
│   ├── 08_industrial_iot_wireless/
│   ├── 09_cellular_telecom_core/
│   ├── 10_hardware_and_specialized/
│   ├── 11_wireshark_testing_fuzzing/
│   └── all_wiki_captures/       # Complete archive of 1,379 Wireshark wiki captures (1.1 GB)
└── data/                        # Structured datasets and metadata
    ├── captures_data.js         # JavaScript dataset (enables zero-CORS offline browsing)
    ├── captures_metadata.json   # Full JSON metadata for all 623 captures
    ├── captures_metadata.csv    # CSV export for spreadsheet analysis
    └── study_guides.json        # Curated learning tracks and study checkpoints
```

---

## 🔬 Example Wireshark Terminal Commands

Open a capture directly in the Wireshark GUI:
```bash
wireshark "captures/01_network_fundamentals/ipv4frags.pcap" &
```

Inspect with `tshark` command line:
```bash
# Print packet summary
tshark -r "captures/01_network_fundamentals/ipv4frags.pcap"

# Filter by IPv4 fragmentation
tshark -r "captures/01_network_fundamentals/ipv4frags.pcap" -Y "ip.flags.mf == 1 || ip.frag_offset > 0"

# Follow HTTP stream in text
tshark -r "captures/02_web_and_internet/http.cap" -q -z follow,http,ascii,0

# Inspect VoIP SIP call setup
tshark -r "captures/05_voip_telecom_multimedia/sip.pcap" -Y "sip"
```

---

## 📊 Dataset Metadata Structure

Each capture entry includes:
- `id`: Unique identifier (e.g., `CAP-001`)
- `filename`: Local filename (e.g., `ipv4frags.pcap`)
- `title`: Formatted readable title
- `level`: Mastery level (1 = Beginner, 2 = Intermediate, 3 = Advanced, 4 = Expert)
- `situation_name`: Grouping domain (e.g., "Network Fundamentals & Addressing")
- `protocols`: Array of relevant protocols (e.g., `["IP", "IPv4", "UDP", "Fragmentation"]`)
- `display_filter`: Tailored Wireshark display filter
- `study_tip`: Key packet structures and flags to inspect
- `tshark_cmd`: Pre-formatted terminal inspection command
- `relative_path`: Path to the `.pcap` / `.pcapng` file
- `size_formatted`: File size (e.g., `2.9 KB`)
