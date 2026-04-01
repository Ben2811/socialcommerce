import Link from "next/link";
import { Facebook, Youtube, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card text-muted-foreground py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-card-foreground font-bold mb-4">
              Về chúng tôi
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Chính sách
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-bold mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Danh mục
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Flash sale
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Hot deals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-bold mb-4">Theo dõi</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Social Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
