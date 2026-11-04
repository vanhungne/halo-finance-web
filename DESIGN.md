04/11 — [Consumer dashboard demo `/app/*` đã gỡ](../docs/WEB_DEMO_RETIRED_2026-11-04.md). Các mô tả responsive consumer demo trước đây là evidence lịch sử, không phải UI đang tồn tại.

04/11 — [Responsive ngoài admin](../docs/WEB_MOBILE_RESPONSIVE_2026-11-04.md): target thao tác44px, field mobile16px, bảng cuộn trong vùng riêng, modal theo100dvh/safe area. Số tiền dài không bị ellipsis; thống kê nhóm theo cuộn trang trên mobile. Giữ nền section/nhận diện hiện có, không đổi luồng admin.

04/11 — [Nhóm quản lý cục bộ](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md#ngừng-chia-sẻ-nhóm-trên-web). Header nhóm gốc chỉ có thao tác Thêm chi tiêu. Cài đặt nằm sau Thống kê.

04/11 — [Chia sẻ và Cài đặt nhóm](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md#modal-chia-sẻ-và-tab-cài-đặt). Modal Chia sẻ dùng header chữ và nút đóng, ba mục gọn. Form Cài đặt nằm trong tab cuối của nhóm gốc.

04/11 expense toolbar: chỉ giữ search và sort; không hàng tab lọc danh mục/người trả. Danh sách vẫn có section thời gian và category icon của từng khoản. [Source/QA](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md).

04/11 expense grouping: bỏ clock toggle, luôn có section thời gian. Nhóm mới nhất trước trừ Cũ nhất; sort tiền chỉ áp dụng trong mỗi nhóm. [Source/QA](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md).

04/11 group back: bỏ hàng navigation riêng và count nhóm đã lưu; back44×44px tròn nền slate100 ngay trái title, focus ring/accessible label, route về danh sách nhóm. [Source/QA](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md).

04/11 group view: mọi người xem cùng tên thành viên, không prompt/select Tôi, không Của tôi/nhãn Bạn hoặc màu nhấn riêng người xem. Form nhập tên thật để trống ban đầu; thống kê hiển thị đủ tên. [Source/QA](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md).

04/11 group title: plain h1, không group icon/star/chevron/dropdown; tên dài wrap, shared giữ nhãn text Chỉ xem. Không modal đổi nhóm; dùng Danh sách nhóm để chuyển. [Source/QA](../docs/group_split_web/GROUP_FORM_REDESIGN_2026-11-04.md).

04/11 group header follow-up: không hiển thị card Tóm tắt của bạn, Đổi người hoặc banner chọn danh tính dưới header; title/actions nối thẳng thống kê toàn nhóm. Lựa chọn identity ở form tạo/sửa giữ nguyên. [QA](../docs/group_split_web/GROUP_FORM_REDESIGN_2026-11-04.md).

04/11 group permissions: bản chia sẻ chỉ còn thao tác đọc/đổi góc nhìn số dư; bỏ settings, expense mutations, clone editable, nút ghi nhận thanh toán và bank editor kể cả khi chưa có STK. Hàng danh sách shared không có edit/delete/clone. [Scope/local evidence và giới hạn ownership](../docs/group_split_web/SHARED_READ_ONLY_2026-11-04.md).

04/11 group form: modal native sáng, rộng tối đa560px, header chỉ title/Close, body phẳng có nhãn tiếng Việt, currency select, ghi chú thu gọn, thành viên đánh số. Footer nằm ngoài body cuộn; input44px, mobile16px, action44px, keyboard containment/Escape/focus restore. [Source/QA](../docs/group_split_web/GROUP_FORM_REDESIGN_2026-11-04.md).

04/11 group list follow-up: list dùng hàng trắng viền mảnh/bo14px, tên + metadata + clock, action icons44px ở phải/đáy mobile. Cùng ngày chỉ giờ/phút; khác ngày có chữ “ngày”, rút gọn tháng/năm theo lịch Việt Nam; full date accessible. Đã bỏ banner xanh; iconplus+Tạo nhóm không nền/viền cùng hàng search cả mobile. [Source/QA](../docs/group_split_web/GROUP_LIST_ROWS_2026-11-04.md).

04/11 card follow-up: toàn bộ card công cụ liên quan là native link, hover−4px/bóng nhẹ/easing cùng feature directory, focus ring và reduced motion. Không giới hạn hit target ở title. [Source/QA](../docs/tools_hub/TOOLS_INSIGHTS_REDESIGN_2026-11-04.md#follow-up-toàn-bộ-card-có-thể-bấm--04112026).

04/11 insights follow-up: Fear & Greed dùng gauge bán nguyệt và mốc so sánh, lạm phát dùng cột âm/dương và thanh sức mua; vàng/bạc chọn đơn vị trực tiếp; crypto/ngân hàng rõ nhận diện và thao tác. Giữ nền sáng/Be Vietnam Pro/xanh hiện hành, thông tin thật, thiếu mốc không dựng dữ liệu. [Source/QA](../docs/tools_hub/TOOLS_INSIGHTS_REDESIGN_2026-11-04.md).

04/11 actions follow-up: copy/update/download dùng icon không text/viền; copy trong ô quy đổi trước currency, toolbar refresh góc trên phải và download bên trái. Vùng bấm44px/aria/focus, check sau copy và lỗi còn. [Source/QA](../docs/tools_hub/ICON_ACTIONS_2026-11-04.md).

04/11 converter follow-up: Amount/currency chung hàng trong hai ô xếp dọc, swap tròn giữa, rate/date đầu và daily trend cuối. Giữ xanh nền tảng, flags tròn/picker search. Nhãn ghi tỷ giá tham khảo theo ngày, không dùng claim real-time từ mẫu. [Source/QA](../docs/tools_hub/CURRENCY_CONVERTER_REDESIGN_2026-11-04.md).

04/11 currency follow-up: ô chọn tiền tệ dùng popup có cờ từng dòng + mã/tên, tìm kiếm và keyboard, dùng chung Quy đổi/Tỷ giá lịch sử. Desktop neo ô chọn; mobile rộng theo viewport, top layer tránh clipping. [Source/QA](../docs/tools_hub/CURRENCY_PICKER_FLAGS_2026-11-04.md). Thay mô tả native select trước đây.

04/11 Resources follow-up: luồng Cẩm nang quản trị/Ebook đã RETIRED theo yêu cầu. Menu chỉ còn So sánh tính năng/FAQ; footer bỏ các mục mở Ebook; không còn modal/form nhận tài liệu. [Scope và QA](../docs/landing_reference/EBOOK_FLOW_RETIRED_2026-11-04.md).

04/11 navigation follow-up hiện hành: bỏ breadcrumb và trang Tất cả công cụ, menu chỉ còn sáu cụm link trực tiếp; không toolbar hub. Footer bỏ link trang tổng hợp. [Source và bằng chứng](../docs/tools_hub/DIRECTORY_REMOVED_2026-11-04.md).

04/11 tools visual follow-up: dùng ảnh SVG thanh vàng/bạc, cờ 4×3 đi kèm mã tiền trong Pair/preset/result; metadata/tên/mã vẫn là thông tin chính. Icon dùng chung menu/card/detail, nền section giữ nguyên; native select trên mobile xếp dọc. [Nguồn/license và QA](../docs/tools_hub/VISUAL_ASSETS_2026-11-04.md).

# Landing visual system

04/11 navigation follow-up: Công cụ dùng menu nhóm hai cột desktop với dải tiêu đề xám nhạt và icon tròn trước mỗi tiện ích; mobile tái sử dụng cùng nội dung, xếp dọc trong dialog cuộn. Tính năng là liên kết trực tiếp tới `#features`, không dropdown. Giữ font/nền section và public-copy rules hiện hữu. [Source và QA](../docs/landing_reference/GROUPED_TOOLS_MENU_2026-11-04.md).

## Tools surface brief — adopted 03/11/2026

Scope `/tools/` and `/tools/{slug}/`, visitor mode **Operate**. Preserve landing identity and its sections: Be Vietnam Pro, white surfaces, ink `#0f172a`, accent `#2845ed`, divider `#dfe5ef`, inherited dark footer. This expands the public site with utility pages; it does not replace the homepage or admin design.

One H1, breadcrumb, useful interactive form before explanations. Desktop input/result split, mobile stacked; restrained table dividers and tabular numeric values, visible labels/focus/errors. Tool directory is a compact searchable/category grid with no usage-count claims. Actual data date, unit and limitations travel with each result; warnings retain last good data clearly. Follow-up04/11: API/provider details stay outside public copy; retain only required data attribution for Fear & Greed and inflation/CPI, as approved by the user. Chart always has a data table, no decorative/fabricated history, reduced motion respected. No account required, no personal input in URLs/storage/tracking. QR stays unavailable pending provider gate. [Implementation and bounded QA](../docs/tools_hub/IMPLEMENTATION_2026-11-03.md).

## Homepage authority

Scope: public homepage `.landing-page`, visitor mode **Persuade**. Adopted on 2026-10-30 at the user's explicit request, using the rendered [Công Cụ Nhanh](https://congcunhanh.com/) as the visual reference. This replaces the previous Dean Studio typography/dark-footer treatment on the homepage. Admin and other public routes keep their existing design.

- Font: self-hosted **Be Vietnam Pro**, normal 400/500/600/700, Latin/Latin extended/Vietnamese subsets; `font-display: swap`, metric-adjusted Arial fallback, no synthesized weights. Keep the SIL OFL license with the assets.
- Background follow-up30/10: preserve the original backgrounds of every section, including the pale Hero gradient, its purple highlights and the dark `#161619` footer. Reference typography is applied independently of section background colors.
- Hero: dark headline up to54px/700 on the original light background, existing three-line message and app artwork; Google Play/App Store actions stay intact.
- Typography: section heading26–32px/600, subheading18px/600, body15.5–16px/400 with1.65 line height, nav14px/500, footer14px. Directory headings21px; feature names17px/600, descriptions15px.
- Colors: ink `#0f172a`, muted text `#475467`, accent `#2845ed`, divider `#dfe5ef`. Section background colors/gradients come from their original components, without alternating-surface overrides. Keep light text on the original dark footer.
- Containers: retain the current section composition. Use soft dividers, restrained16px panel radii, minimal elevation, no decorative ambient glow. Keep device mockup geometry isolated with `data-landing-preview`.
- Features remain three stacked groups: Personal / Groups / Business. No new marketing claims, sections or capabilities are introduced by the style change.
- Section order adopted31/10: Hero → Before/After → Solutions → Simulator → Feature directory → Comparison → Free commitment → Security → Reviews → Financial health quiz → FAQ → Download CTA → Footer. Preserve all original section backgrounds. [Implementation evidence](../docs/landing_reference/LANDING_SECTION_ORDER_IMPLEMENTED_2026-10-31.md).
- The `#before-after` section now follows Hero, with five paired situations. Desktop uses two columns and a continuous white result column on a neutral gray field; mobile keeps each before/after pair together. Solutions uses the same Personal/Groups/Business taxonomy as the directory. The business simulator labels its figures as illustrative.
- Header switches to its collapsed menu below1280px to accommodate both languages. Native focus outlines, text selection, reduced-motion behavior and readable mobile wrapping are part of the system.
- Reviews follow-up31/10: plain heading and visible sample-content notice; six existing quotes with names and role/location text, no avatars/verified marks/timestamps/audience-count claim. Yellow stars reflect each sample rating, restored at the user's request. Light16px panels in1/2/3columns, preserving the white section background. [Evidence](../docs/landing_reference/USER_REVIEWS_RESTYLE_2026-10-31.md).

Implementation authority: `src/styles/landingTheme.css`, `src/styles/landingFonts.css`; source and verification details in [the checkpoint](../docs/landing_reference/LANDING_STYLE_CONGCUNHANH_2026-10-30.md). Styling is scoped to `.landing-page`, not a global reset or an admin theme.

- Financial survey31/10: preserve the light background and shared font; flat white form with fine dividers, two explicit parts (6+4), five native radio choices, two-column choices at≤380px. No decorative completion animation. Reference scoring/advice and translation limitations are visible; local state only. [Implementation/evidence](../docs/landing_reference/FINANCIAL_WELLBEING_SURVEY_2026-10-31.md).
- Security section31/10: friendly centered title/subtitle above six static capability cells; one shared white frame with rounded16px corners and continuous thin dividers, colored Lucide icon/title at the top and description below. Use3columns from1024px,2at600–1023px,1below600px; preserve the existing pale background, Be Vietnam Pro, position and `#security` anchor. Footer links to existing `/privacy`; factual capability copy carries no certification or absolute protection assurance. This is a section-specific pattern. [Implementation/evidence](../docs/landing_reference/SECURITY_SECTION_REDESIGN_2026-10-31.md).
- Mobile navigation31/10: below1280px use a white full-viewport native dialog with logo/round Close, four accordion groups from the desktop datasets, light language controls and a fixed download footer; keep Be Vietnam Pro, visible focus, safe-area and contained scrolling. The small-screen download dock is one light-surface app-download action. Desktop composition stays intact; this is a local navigation pattern. [Implementation/evidence](../docs/landing_reference/MOBILE_NAVIGATION_REFRESH_2026-10-31.md).
- Why-choose follow-up31/10: copy changes and the temporary layout experiment were reverted at the user’s request. The full original comparison component/data is restored for the user to edit. [Historical evidence](../docs/landing_reference/WHY_CHOOSE_COPY_REVIEW_2026-10-31.md).
