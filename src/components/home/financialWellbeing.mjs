// CFPB standard 10-item worksheet, page 3. Checked 2026-10-31.
// Columns: self 18–61, self 62+, interviewer 18–61, interviewer 62+.
// Do not replace this calibrated lookup with raw / 40 * 100.
export const SCALE_SOURCE = 'https://files.consumerfinance.gov/f/documents/bcfp_fin-well-being_full-scorecard.pdf';
export const RANGE_SOURCE = 'https://www.consumerfinance.gov/consumer-tools/educator-tool/financial-well-being-resources/measure-and-score/';
export const GUIDANCE_SOURCES = [
  'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',
  'https://www.consumerfinance.gov/archive/blog/behind-bills-three-steps-help-you-make-tough-choices-tight-moments/',
];

const SCORE_TABLE = [
  [14,14,16,18], [19,20,21,23], [22,24,24,26], [25,26,27,28],
  [27,29,29,30], [29,31,31,32], [31,33,33,33], [32,35,34,35],
  [34,36,36,36], [35,38,38,38], [37,39,39,39], [38,41,40,40],
  [40,42,42,41], [41,44,43,43], [42,45,44,44], [44,46,45,45],
  [45,48,47,46], [46,49,48,47], [47,50,49,48], [49,52,50,49],
  [50,53,52,50], [51,54,53,52], [52,56,54,53], [54,57,55,54],
  [55,58,57,55], [56,60,58,56], [58,61,59,57], [59,63,60,58],
  [60,64,62,60], [62,66,63,61], [63,67,65,62], [65,69,66,64],
  [66,71,68,65], [68,73,70,67], [69,75,71,68], [71,77,73,70],
  [73,79,76,72], [75,82,78,75], [78,84,81,77], [81,88,85,81],
  [86,95,91,87],
];

// Vietnamese is a reference translation, not a validated local version.
// English preserves the official questionnaire; option values are display indexes.
export const QUESTIONS = [
  { id: 1, positive: true, vi: 'Tôi có thể xoay xở với một khoản chi lớn bất ngờ.', en: 'I could handle a major unexpected expense' },
  { id: 2, positive: true, vi: 'Tôi đang tạo dựng sự vững vàng cho tương lai tài chính của mình.', en: 'I am securing my financial future' },
  { id: 3, positive: false, vi: 'Vì tình hình tiền bạc, tôi cảm thấy mình sẽ không bao giờ có được những điều mong muốn trong cuộc sống.', en: 'Because of my money situation, I feel like I will never have the things I want in life' },
  { id: 4, positive: true, vi: 'Cách quản lý tiền bạc hiện tại giúp tôi tận hưởng cuộc sống.', en: 'I can enjoy life because of the way I’m managing my money' },
  { id: 5, positive: false, vi: 'Về tài chính, tôi chỉ vừa đủ xoay xở qua ngày.', en: 'I am just getting by financially' },
  { id: 6, positive: false, vi: 'Tôi lo rằng số tiền mình đang có hoặc sẽ tiết kiệm được sẽ không đủ dùng lâu dài.', en: 'I am concerned that the money I have or will save won’t last' },
  { id: 7, positive: false, vi: 'Chi tiền mừng cưới, quà sinh nhật hoặc dịp khác sẽ khiến tài chính trong tháng của tôi bị căng thẳng.', en: 'Giving a gift for a wedding, birthday or other occasion would put a strain on my finances for the month' },
  { id: 8, positive: true, vi: 'Tôi còn dư tiền vào cuối tháng.', en: 'I have money left over at the end of the month' },
  { id: 9, positive: false, vi: 'Tôi bị chậm trễ trong việc thực hiện các nghĩa vụ tài chính của mình.', en: 'I am behind with my finances' },
  { id: 10, positive: false, vi: 'Tình hình tài chính chi phối cuộc sống của tôi.', en: 'My finances control my life' },
];

export const OPTIONS = {
  vi: [
    ['Hoàn toàn', 'Rất đúng', 'Phần nào', 'Rất ít', 'Không hề'],
    ['Luôn luôn', 'Thường xuyên', 'Thỉnh thoảng', 'Hiếm khi', 'Không bao giờ'],
  ],
  en: [
    ['Completely', 'Very well', 'Somewhat', 'Very little', 'Not at all'],
    ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
  ],
};

export const BANDS = [
  { max: 29, min: 0, vi: 'Rất thấp', en: 'Very low' },
  { max: 37, min: 30, vi: 'Thấp', en: 'Low' },
  { max: 49, min: 38, vi: 'Trung bình thấp', en: 'Medium low' },
  { max: 57, min: 50, vi: 'Trung bình cao', en: 'Medium high' },
  { max: 67, min: 58, vi: 'Cao', en: 'High' },
  { max: 100, min: 68, vi: 'Rất cao', en: 'Very high' },
];

export function answerPoints(question, option) {
  if (!Number.isInteger(option) || option < 0 || option > 4) throw new RangeError('Invalid response');
  return question.positive ? 4 - option : option;
}

export function convertScore(raw, age, mode) {
  if (!Number.isInteger(raw) || raw < 0 || raw > 40) throw new RangeError('Invalid raw score');
  if (!['18-61', '62+'].includes(age) || !['self', 'assisted'].includes(mode)) throw new RangeError('Invalid scoring group');
  return SCORE_TABLE[raw][(mode === 'assisted' ? 2 : 0) + (age === '62+' ? 1 : 0)];
}

export function scoreBand(score) {
  if (!Number.isInteger(score) || score < 0 || score > 100) throw new RangeError('Invalid score');
  return BANDS.find((band) => score <= band.max);
}

// Editorial suggestions, not additional scale items or validated sub-scores.
// Urgent bill pressure takes precedence; ties otherwise keep this explicit order.
const TOPICS = [
  { key: 'bills', ids: [9] },
  { key: 'buffer', ids: [1, 6] },
  { key: 'cashflow', ids: [5, 8] },
  { key: 'pressure', ids: [4, 10] },
  { key: 'occasions', ids: [7] },
  { key: 'goals', ids: [2, 3] },
];

export function evaluateSurvey(answers, age, mode) {
  const points = QUESTIONS.map((question) => answerPoints(question, answers?.[question.id]));
  const raw = points.reduce((total, value) => total + value, 0);
  const score = convertScore(raw, age, mode);
  const topics = TOPICS.map((topic, order) => {
    const questionId = topic.ids.reduce((lowest, id) => points[id - 1] < points[lowest - 1] ? id : lowest);
    return { ...topic, order, questionId, points: points[questionId - 1] };
  });
  const priorities = topics.filter((topic) => topic.points <= 2)
    .sort((a, b) => Number(b.key === 'bills' && b.points <= 1) - Number(a.key === 'bills' && a.points <= 1) || a.points - b.points || a.order - b.order)
    .slice(0, 3);
  return {
    raw, score, band: scoreBand(score), priorities,
    strengths: topics.filter((topic) => topic.points >= 3).slice(0, 2).map((topic) => topic.key),
  };
}

export const ADVICE = {
  bills: {
    vi: ['Ưu tiên các khoản đến hạn', 'Liệt kê khoản phải trả và ngày đến hạn, dành tiền cho nhu cầu thiết yếu trước. Nếu dự kiến chậm trả, chủ động liên hệ bên nhận thanh toán để trao đổi phương án phù hợp.'],
    en: ['Start with upcoming bills', 'List what is due and when, and protect essential living costs. If you expect to miss a payment, contact the provider or creditor early to discuss available arrangements.'],
  },
  buffer: {
    vi: ['Tạo một khoảng đệm vừa sức', 'Chọn một khoản chi bất ngờ thường gặp làm mục tiêu dự phòng đầu tiên. Để riêng một khoản nhỏ khi có thể, sau khi đáp ứng nhu cầu thiết yếu; không cần ép mình theo một tỷ lệ cố định.'],
    en: ['Build a manageable buffer', 'Use a typical unexpected expense as your first savings goal. Set aside a small amount when possible after essentials, rather than forcing a fixed savings percentage.'],
  },
  cashflow: {
    vi: ['Nhìn rõ tiền vào và tiền ra', 'Ghi lại thu chi trong một tháng, kèm ngày nhận tiền và ngày phải trả. Chọn một khoản có thể điều chỉnh và đặt hạn mức vừa sức, thay vì cắt giảm mọi thứ cùng lúc.'],
    en: ['Make cash flow visible', 'Track income and spending for a month, including pay dates and bill dates. Pick one flexible expense to adjust and set a realistic limit instead of cutting everything at once.'],
  },
  pressure: {
    vi: ['Giảm áp lực bằng một việc nhỏ', 'Chọn một khoảng thời gian cố định mỗi tuần để xem lại tiền bạc và xử lý một việc cụ thể. Nếu cảm thấy quá tải, có thể nhờ người đáng tin cậy cùng rà soát các khoản đến hạn.'],
    en: ['Make the next step smaller', 'Choose a regular weekly time to review money and handle one concrete task. If it feels overwhelming, ask someone you trust to help review upcoming commitments.'],
  },
  occasions: {
    vi: ['Dành trước tiền cho các dịp đặc biệt', 'Ghi lại những dịp sắp tới và đặt tổng mức chi phù hợp khả năng. Nếu còn dư sau nhu cầu thiết yếu, chia nhỏ khoản dự kiến để dành dần; món quà không cần vượt quá sức của bạn.'],
    en: ['Plan for occasional costs', 'List upcoming occasions and set a total you can afford. When essentials are covered, save a little toward these costs; a gift does not need to stretch your finances.'],
  },
  goals: {
    vi: ['Chia mục tiêu thành bước nhỏ', 'Chọn một mục tiêu gần, ghi số tiền cần có và thời điểm mong muốn. Đối chiếu với phần có thể để dành rồi điều chỉnh số tiền hoặc thời hạn cho phù hợp hoàn cảnh.'],
    en: ['Break a goal into smaller steps', 'Choose one near-term goal, its cost and a target date. Compare it with what you can set aside, then adjust the amount or timing to fit your circumstances.'],
  },
};

export const STRENGTHS = {
  bills: { vi: 'Bạn cho biết mình ít bị chậm trễ về tài chính.', en: 'You report few delays in meeting financial commitments.' },
  buffer: { vi: 'Bạn cảm thấy có khả năng xoay xở và ít lo tiền không đủ dùng.', en: 'You feel able to handle surprises and less concerned about money running out.' },
  cashflow: { vi: 'Bạn cho biết thường còn dư tiền và không chỉ vừa đủ xoay xở.', en: 'You report having money left over rather than only getting by.' },
  pressure: { vi: 'Bạn cảm thấy cách quản lý tiền hỗ trợ cuộc sống của mình.', en: 'You feel your money management supports your life.' },
  occasions: { vi: 'Các dịp tặng quà ít tạo áp lực lên ngân sách của bạn.', en: 'Gift-giving occasions put less strain on your budget.' },
  goals: { vi: 'Bạn cảm thấy có định hướng và hy vọng cho tương lai tài chính.', en: 'You feel direction and hope about your financial future.' },
};

export const MAINTENANCE = {
  vi: [
    ['Duy trì việc xem lại thu chi', 'Đối chiếu số dư, các khoản đến hạn và kế hoạch chi tiêu đều đặn; cập nhật khi thu nhập hoặc nhu cầu thay đổi.'],
    ['Rà soát khoản dự phòng', 'Kiểm tra khoản để dành có còn phù hợp với các chi phí bất ngờ trong hoàn cảnh hiện tại của bạn hay không.'],
    ['Cập nhật mục tiêu tiếp theo', 'Chọn một mục tiêu phù hợp khả năng hiện tại và theo dõi tiến độ, không cần tăng mức tiết kiệm chỉ để đạt điểm cao hơn.'],
  ],
  en: [
    ['Keep reviewing cash flow', 'Regularly check balances, upcoming bills and spending plans; update them when income or needs change.'],
    ['Review your emergency buffer', 'Check whether your reserve still suits the unexpected costs that could arise in your current circumstances.'],
    ['Update your next goal', 'Choose a goal that fits your situation and track progress, without increasing savings just to chase a higher score.'],
  ],
};
