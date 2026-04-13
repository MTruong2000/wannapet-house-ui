import AboutWannapetClient from "./about-wannapet-client";

interface ContentBlockItem {
  label: string;
  content: string;
  icon?: string;
}

interface ContentBlock {
  id: string;
  block_key: string;
  title: string;
  intro: string | null;
  items: ContentBlockItem[];
  location_id: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentBlockApiResponse {
  success: boolean;
  message: string;
  data: ContentBlock;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const MOCK_BLOCK: ContentBlock = {
  id: "1",
  block_key: "about_wannapet_home",
  title: "WannaPet House",
  intro:
    "WannaPet là thiên đường cho những người yêu thú cưng với đa dạng sản phẩm và dịch vụ chăm sóc chất lượng.",
  items: [
    {
      label: "Thức ăn chất lượng",
      content:
        "Chúng tôi cung cấp nhiều dòng thức ăn phù hợp cho từng độ tuổi và thể trạng của thú cưng.",
    },
    {
      label: "Phụ kiện và đồ chơi",
      content:
        "Từ đồ chơi, dây dắt, quần áo đến các vật dụng tiện ích hằng ngày dành cho thú cưng.",
    },
    {
      label: "Dịch vụ chăm sóc",
      content:
        "Bao gồm tắm, cắt tỉa lông và nhiều dịch vụ hỗ trợ giúp thú cưng luôn sạch sẽ, khỏe mạnh.",
    },
  ],
  location_id: null,
  is_default: true,
  is_active: true,
  created_at: "",
  updated_at: "",
};

async function getContentBlock(): Promise<ContentBlock> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/content-block?block_key=about_wannapet_home`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const json: ContentBlockApiResponse = await res.json();

    if (!json.success || !json.data) {
      throw new Error("Invalid API response");
    }

    return json.data;
  } catch (error) {
    console.error("Fetch content block failed:", error);
    return MOCK_BLOCK;
  }
}

export default async function AboutWannapet() {
  const data = await getContentBlock();

  return <AboutWannapetClient data={data} />;
}
