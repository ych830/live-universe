export interface TicketLink {
  /** vendors.ts 의 id (nol, yes24, melon, ticketlink, etc) */
  vendor: string;
  /** vendor 가 etc 일 때 버튼에 보일 이름 */
  label?: string;
  url: string;
}

export interface Company {
  slug: string;
  name: string;
  nameEn?: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  instagram?: string;
  order: number;
}

export interface Performance {
  slug: string;
  title: string;
  subtitle?: string;
  artist?: string;
  /** Company.slug */
  company?: string;
  poster?: string;
  gallery: string[];
  /** 예매처 상세페이지처럼 원래 비율 그대로 세로로 이어 보여주는 긴 이미지 */
  detailImages: string[];
  /** YYYY-MM-DD (한국 시간 기준 날짜) */
  startDate: string;
  endDate?: string;
  /** 예: "토 18:00 / 일 17:00" */
  timeText?: string;
  venue?: string;
  ageRating?: string;
  runningTime?: string;
  price?: string;
  /** ISO 날짜시간. 이 시각 전이면 '오픈 예정' */
  ticketOpenAt?: string;
  ticketLinks: TicketLink[];
  featured: boolean;
  description?: string;
}
