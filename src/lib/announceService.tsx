import { mockAnouncement } from "@/data/mock_announcement";
import { Announcement } from "@/types/announcement";

export async function getAnnounceById(announceId: number): Promise<Announcement | null> {
    return mockAnouncement.find(p => p.announceId === announceId) ?? null;
  }