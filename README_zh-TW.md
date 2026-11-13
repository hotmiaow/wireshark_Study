# Wireshark 經典封包深度研析實驗室 (Wireshark Sample Captures Lab)

本專案自 Wireshark 官方 Wiki（[SampleCaptures](https://gitlab.com/wireshark/wireshark/-/wikis/SampleCaptures)）下載並完整收錄所有官方經典網路封包樣本。

全站已依據 **4 大技術難度等級** 與 **11 種真實網路場景** 進行系統化分類，並針對每個樣本導入**「正常狀態」、「異常現象」與「如何排查問題」**三段式實戰診斷架構，搭配即開即用的視覺化網頁分析平台與終端指令。

---

## 🌟 核心特色與亮點

- **623 個官方精選封包樣本**：涵蓋從基礎網路協定到高級工控與電信骨幹的完整資料。
- **1,379 個本地完整典藏檔案 (~1.1 GB)**：位於 `captures/all_wiki_captures/`，收錄 Wiki 提及之全部上傳樣本。
- **三段式深度診斷框架 (3-Part Diagnostic Framework)**：
  1. 🟢 **什麼是正常狀態**：標準通訊協定行為、正確交握流程與預期回覆碼。
  2. 🔴 **什麼是問題/異常現象**：封包丟失、零視窗凍結、蠕蟲攻擊負載、緩衝區溢位、連線逾時或認證失敗。
  3. 🔍 **如何檢查與排查問題**：在 Wireshark 中使用的精確顯示過濾器、應檢驗的標頭旗標、以及分析工具選單路徑。
- **繁體中文 / 英文雙語切換**：支援即時介面語言與診斷說明切換。
- **100% 離線免安裝**：免架設資料庫或建置環境，瀏覽器直接開啟 `index.html` 即可流暢操作，亦提供內建輕量 HTTP 伺服器。

---

## 🎯 4 大難度等級劃分

| 技術等級 | 難度定位 | 收錄數量 | 核心學習內容與協定 |
| :--- | :--- | :---: | :--- |
| 🟢 **第 1 級：初級入門**<br>*(Beginner)* | 基礎網路通訊 | **42** | 核心定址與基礎探測：ARP 廣播與單播、ICMP Ping 請求與回應、DHCP 4 步驟 DORA 租賃、標準 DNS 解析、IPv4 封包分段 (Identification, Fragment Offset, MF 標記)。 |
| 🔵 **第 2 級：中級進階**<br>*(Intermediate)* | 應用層與安全傳輸 | **284** | 常見網路協定與金鑰解密：HTTP/1.1 與 HTTP/2、TLS/SSL 與 SSH 安全交握（附帶 Master-Secret 金鑰解密教學）、SNMP、NTP、Kerberos/NTLMSSP 網域認證、SMB 檔案分享、802.1Q VLAN 標籤、OSPF 內部路由。 |
| 🟣 **第 3 級：高級專家**<br>*(Advanced)* | 企業骨幹與多媒體 | **255** | 核心基礎架構與電信通訊：網際網路 BGP 外部路由、MPLS 標籤堆疊、VoIP 網路語音（SIP 呼叫控制、RTP 串流抖動與音訊還原）、SAN 儲存（iSCSI, Fibre Channel, NFSv4）、電信行動核心網（GTP, Diameter, SIGTRAN）。 |
| 🔴 **第 4 級：資深權威**<br>*(Expert)* | 資安鑑識與工控特規 | **61** | 真實威脅軌跡與工業控制：歷史重大蠕蟲（疾風 Blaster、Sasser、SQL Slammer）、TCP SYN Flood 阻斷服務攻擊、緩衝區溢位 Shellcode 滲透、PROTOS 協議模糊測試、工控 SCADA（Modbus TCP、西門子 S7COMM、BACnet）、Wi-Fi 802.11 監聽訊框。 |

---

## 🏢 11 大實戰領域分類

1. [`captures/01_network_fundamentals/`](captures/01_network_fundamentals/) — **網路基礎與定址**：ARP、ICMP Ping、DHCP、DNS、IPv4 分段。
2. [`captures/02_web_and_internet/`](captures/02_web_and_internet/) — **網頁、API 與網際網路協議**：HTTP/1.1、HTTP/2、REST API、WebSockets、gRPC、Protobuf。
3. [`captures/03_security_and_cryptography/`](captures/03_security_and_cryptography/) — **資安防護、攻擊與密碼解密**：惡意蠕蟲、漏洞利用、SYN Flood、Nmap 連接埠掃描、TLS/SSH 金鑰解密。
4. [`captures/04_troubleshooting_anomalies/`](captures/04_troubleshooting_anomalies/) — **網路疑難排解與傳輸異常**：TCP 重傳 (Retransmission)、重複確認 (Duplicate ACK)、零視窗 (Zero Window)、廣播風暴。
5. [`captures/05_voip_telecom_multimedia/`](captures/05_voip_telecom_multimedia/) — **網路語音 VoIP 與即時多媒體**：SIP 呼叫協商、RTP/RTCP 語音傳輸、手機 AMR 編碼通話、RTSP 視訊串流。
6. [`captures/06_enterprise_routing_switching/`](captures/06_enterprise_routing_switching/) — **企業核心路由與交換架構**：BGP 外部路由、OSPF/IS-IS 內部路由、STP 生成樹、802.1Q VLAN、MPLS、WireGuard/IPsec VPN。
7. [`captures/07_file_storage_enterprise/`](captures/07_file_storage_enterprise/) — **檔案分享、儲存與企業服務**：Windows SMB/CIFS、NFSv3/v4、iSCSI 區塊儲存、微軟 DCE/RPC、Active Directory LDAP。
8. [`captures/08_industrial_iot_wireless/`](captures/08_industrial_iot_wireless/) — **工控物聯網與無線通訊**：Modbus TCP、西門子 S7COMM、BACnet、Wi-Fi 802.11 監聽、藍牙 HCI/L2CAP、ZigBee。
9. [`captures/09_cellular_telecom_core/`](captures/09_cellular_telecom_core/) — **電信蜂巢式核心網路**：GTP 穿隧協定、4G LTE/S1AP、3GPP AMR、Diameter 與 RADIUS 認證、電信 SS7/SIGTRAN 信令。
10. [`captures/10_hardware_and_specialized/`](captures/10_hardware_and_specialized/) — **硬體匯流排與特規封包**：USB 傳輸監聽、Token Ring、AppleTalk、IPX/SPX、SNA、X.25、ATM、專有 Sniffer 格式。
11. [`captures/11_wireshark_testing_fuzzing/`](captures/11_wireshark_testing_fuzzing/) — **Wireshark 測試與模糊測試**：PROTOS 安全模糊測試、畸形封包壓力測試與官方解析器回歸樣本。

---

## 🛠️ 三段式問題診斷實戰指南（範例剖析）

### 範例 1：TCP 傳輸效能低下與丟包
- **正常狀態**：TCP 傳輸序列號 (Sequence Number) 與確認號 (ACK Number) 隨資料位元組平穩單調遞增，往返延遲 (RTT) 穩定，無重複確認與封包重送。
- **異常/問題現象**：網路中間設備佇列滿載或線路雜訊造成區段遺失，接收端回覆三次重複確認 (Duplicate ACK)，觸發發送端快速重傳 (Fast Retransmit)；若嚴重超時則觸發 RTO (Retransmission Timeout) 退避，擁塞視窗急降導致傳輸卡死。
- **如何檢查與排查**：
  1. 輸入顯示過濾器：`tcp.analysis.flags || tcp.analysis.retransmission`。
  2. 開啟 **Analyze → Expert Information**，檢視 Warning 級別的重傳標記。
  3. 點選 **Statistics → TCP Stream Graphs → Time-Sequence (tcptrace)** 圖表，以視覺化斜率直接看出在何時發生序號斷層與視窗縮減。

### 範例 2：TCP 零視窗凍結 (Zero Window)
- **正常狀態**：接收端持續通告充裕的可用緩衝區（Window Size > 64 KB），發送端持續發送資料而無須停頓。
- **異常/問題現象**：接收端主機 CPU 繁忙或應用程式處理延遲，無法及時自 Socket 接收緩衝區取走資料，使緩衝區塞滿並通告 `Window Size = 0`，發送端被迫完全暫停發送，連線陷入卡死凍結。
- **如何檢查與排查**：
  1. 輸入顯示過濾器：`tcp.analysis.zero_window || tcp.analysis.window_full`。
  2. 觀察發送端在停頓期間定期送出的 `TCP ZeroWindowProbe`（零視窗探針），檢查接收端在多久後才回覆帶有可用視窗的 `Window Update`。
  3. 問題定位點在接收端伺服器軟體或磁碟 I/O，而非發送端或網路線路。

### 範例 3：疾風蠕蟲病毒滲透 (Blaster Worm)
- **正常狀態**：正常主機僅會透過授權通訊埠與特定內部伺服器連線，並傳送合法的 RPC 函式指令。
- **異常/問題現象**：受感染主機向隨機或連續 IP 之 TCP 135 連接埠高頻發送連線探針，在 DCE/RPC 負載中夾帶微軟 DCOM 漏洞 (MS03-026) 攻擊碼，利用長字串引發堆疊緩衝區溢位，並注入 Shellcode 劫持控制權以啟動 TFTP 下載惡意執行檔。
- **如何檢查與排查**：
  1. 輸入顯示過濾器：`tcp.port == 135`。
  2. 檢視封包詳細視窗中的 Data 或 Stub Data，尋找連續出現的 `0x90` (NOP Sled) 與可疑指令碼。
  3. 開啟 **Statistics → Conversations**，按封包數排序即可揪出網段內正在發起掃描的被感染主機 IP。

---

## 🚀 快速上手使用

### 方式 1：瀏覽器直接點擊開啟（免伺服器）
直接使用預設瀏覽器開啟 `index.html`：
```bash
xdg-open index.html
# 或
google-chrome index.html
# 或
firefox index.html
```

### 方式 2：執行內建輕量 Web 伺服器
```bash
python3 start_server.py
```
啟動後於瀏覽器開啟：**`http://localhost:8000`**

---

## 💻 常用 Wireshark 終端排查指令範本

以 GUI 介面開啟特定封包：
```bash
wireshark "captures/01_network_fundamentals/ipv4frags.pcap" &
```

使用 TShark 命令列過濾 IPv4 分段封包：
```bash
tshark -r "captures/01_network_fundamentals/ipv4frags.pcap" -Y "ip.flags.mf == 1 || ip.frag_offset > 0"
```

追蹤 HTTP 純文字交談串流：
```bash
tshark -r "captures/02_web_and_internet/http.cap" -q -z follow,http,ascii,0
```

統計通訊對話 (Conversations) 中的 IP 傳輸排行榜：
```bash
tshark -r "captures/03_security_and_cryptography/blaster.pcap" -q -z conv,ip
```
