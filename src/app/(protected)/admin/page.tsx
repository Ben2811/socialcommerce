import {
	ArrowUpRight,
	BadgePercent,
	Bell,
	ChartColumnIncreasing,
	CheckCircle2,
	CircleDollarSign,
	Clock3,
	Package,
	ShoppingCart,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	Users,
	AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const overviewStats = [
	{
		label: "Người dùng",
		value: "1,284",
		change: "+12.4%",
		note: "so với tháng trước",
		icon: Users,
		accent: "from-amber-500 to-orange-400",
	},
	{
		label: "Sản phẩm",
		value: "376",
		change: "+8.1%",
		note: "đang hoạt động",
		icon: Package,
		accent: "from-sky-500 to-cyan-400",
	},
	{
		label: "Đơn hàng hôm nay",
		value: "96",
		change: "+19.6%",
		note: "đơn đã ghi nhận",
		icon: ShoppingCart,
		accent: "from-emerald-500 to-lime-400",
	},
	{
		label: "Doanh thu tháng",
		value: "18.4M",
		change: "+23.0%",
		note: "VNĐ sau hoàn tiền",
		icon: CircleDollarSign,
		accent: "from-rose-500 to-red-400",
	},
];

const weeklyTrend = [
	{ day: "T2", orders: 42, revenue: 34 },
	{ day: "T3", orders: 58, revenue: 47 },
	{ day: "T4", orders: 51, revenue: 39 },
	{ day: "T5", orders: 66, revenue: 58 },
	{ day: "T6", orders: 72, revenue: 64 },
	{ day: "T7", orders: 88, revenue: 78 },
	{ day: "CN", orders: 96, revenue: 84 },
];

const categoryMix = [
	{ name: "Điện tử", value: 42, color: "bg-amber-500" },
	{ name: "Thời trang", value: 28, color: "bg-sky-500" },
	{ name: "Gia dụng", value: 18, color: "bg-emerald-500" },
	{ name: "Khác", value: 12, color: "bg-rose-500" },
];

const recentActivities = [
	{
		action: "Người dùng mới đăng ký",
		detail: "tranthuy@example.com",
		time: "2 phút trước",
		status: "Thành công",
		icon: CheckCircle2,
		tone: "text-emerald-600",
	},
	{
		action: "Đơn hàng chờ xác nhận",
		detail: "#DH-20481 - 2 sản phẩm",
		time: "15 phút trước",
		status: "Đang xử lý",
		icon: Clock3,
		tone: "text-amber-600",
	},
	{
		action: "Cập nhật sản phẩm",
		detail: "Áo sơ mi nam basic",
		time: "1 giờ trước",
		status: "Đã duyệt",
		icon: Sparkles,
		tone: "text-sky-600",
	},
	{
		action: "Cảnh báo kiểm duyệt",
		detail: "Nội dung quảng cáo cần xem lại",
		time: "3 giờ trước",
		status: "Lưu ý",
		icon: AlertCircle,
		tone: "text-rose-600",
	},
];

const topSignals = [
	{ label: "Tỷ lệ hoàn tất", value: "94.2%", icon: ShieldCheck },
	{ label: "Tương tác quảng cáo", value: "6.8%", icon: BadgePercent },
	{ label: "Tăng trưởng tuần", value: "+14.9%", icon: TrendingUp },
];

export default function AdminPage() {
	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,248,237,0.88)_0%,rgba(255,255,255,1)_22%,rgba(247,248,252,1)_100%)] text-foreground">
			<div className="mx-auto flex w-full max-w-400 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
				<section className="grid gap-4 rounded-[28px] border border-border/70 bg-white/90 p-5 shadow-[0_20px_80px_rgba(17,24,39,0.06)] backdrop-blur sm:p-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
					<div className="space-y-4">
						<Badge variant="outline" className="w-fit border-amber-200 bg-amber-50 text-amber-700">
							Dashboard tổng quan
						</Badge>
						<div className="space-y-2">
							<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
								Thống kê vận hành cho cửa hàng
							</h1>
							<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
								Theo dõi người dùng, sản phẩm, đơn hàng và doanh thu trong một màn hình duy nhất.
								Dữ liệu hiện đang là mẫu, sẵn sàng thay bằng API thật khi backend trả về.
							</p>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button className="gap-2 rounded-4xl bg-foreground px-5 text-background hover:bg-foreground/90">
								<ChartColumnIncreasing className="size-4" />
								Xem báo cáo chi tiết
							</Button>
							<Button variant="outline" className="gap-2 rounded-4xl px-5">
								<Bell className="size-4" />
								Cảnh báo hệ thống
							</Button>
						</div>
					</div>

					<Card className="border-0 bg-[linear-gradient(135deg,#111827_0%,#1f2937_45%,#f59e0b_130%)] text-white shadow-[0_24px_60px_rgba(17,24,39,0.22)]">
						<CardHeader className="space-y-3 border-b border-white/10 px-6 py-6">
							<div className="flex items-center justify-between gap-3">
								<CardTitle className="text-lg font-semibold text-white">Hôm nay</CardTitle>
								<Badge className="border-0 bg-white/15 text-white hover:bg-white/20">Live</Badge>
							</div>
							<CardDescription className="text-white/70">
								Tình trạng đơn hàng, người dùng và hiệu suất bán hàng đang ở mức tốt.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 px-6 py-6 sm:grid-cols-3">
							{topSignals.map((signal) => (
								<div key={signal.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
									<signal.icon className="mb-4 size-5 text-amber-200" />
									<p className="text-sm text-white/70">{signal.label}</p>
									<p className="mt-1 text-xl font-semibold text-white">{signal.value}</p>
								</div>
							))}
						</CardContent>
					</Card>
				</section>

				<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{overviewStats.map((stat) => (
						<Card key={stat.label} className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)] transition-transform duration-200 hover:-translate-y-1">
							<CardContent className="flex items-start justify-between gap-4 px-5 py-5">
								<div className="space-y-4">
									  <div className={`flex size-11 items-center justify-center rounded-2xl bg-linear-to-br ${stat.accent} text-white shadow-lg`}>
										<stat.icon className="size-5" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">{stat.label}</p>
										<p className="mt-1 text-3xl font-semibold tracking-tight">{stat.value}</p>
									</div>
								</div>

								<div className="flex flex-col items-end gap-2 text-right">
									<Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
										<ArrowUpRight className="mr-1 size-3.5" />
										{stat.change}
									</Badge>
									  <p className="max-w-30 text-xs leading-5 text-muted-foreground">{stat.note}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</section>

				<section className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
					<Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
						<CardHeader className="border-b border-border/60 px-6 py-6">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									<CardTitle className="text-xl">Xu hướng 7 ngày</CardTitle>
									<CardDescription className="mt-1">
										So sánh số đơn hàng và doanh thu theo ngày trong tuần gần nhất.
									</CardDescription>
								</div>
								<Badge variant="outline" className="border-border/70 bg-muted/40 text-foreground">
									<TrendingUp className="mr-1 size-3.5" />
									Đang tăng
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-6 px-6 py-6">
							  <div className="grid min-h-65 grid-cols-7 items-end gap-3 rounded-3xl bg-linear-to-b from-muted/20 to-transparent p-4">
								{weeklyTrend.map((item) => (
									<div key={item.day} className="flex h-full flex-col items-center justify-end gap-3">
										<div className="flex w-full flex-1 items-end justify-center gap-1.5">
											<div
												className="w-full max-w-5 rounded-t-full bg-amber-400/90 shadow-[0_8px_20px_rgba(245,158,11,0.25)]"
												style={{ height: `${item.orders * 2}px` }}
												aria-label={`Đơn hàng ${item.orders} vào ${item.day}`}
											/>
											<div
												className="w-full max-w-5 rounded-t-full bg-sky-500/90 shadow-[0_8px_20px_rgba(14,165,233,0.22)]"
												style={{ height: `${item.revenue * 2}px` }}
												aria-label={`Doanh thu ${item.revenue} vào ${item.day}`}
											/>
										</div>
										<div className="space-y-1 text-center">
											<p className="text-sm font-medium">{item.day}</p>
											<p className="text-xs text-muted-foreground">
												{item.orders} / {item.revenue}
											</p>
										</div>
									</div>
								))}
							</div>

							<div className="grid gap-3 sm:grid-cols-3">
								<div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
									<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Đơn hoàn tất</p>
									<p className="mt-2 text-2xl font-semibold">492</p>
								</div>
								<div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
									<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Giá trị trung bình</p>
									<p className="mt-2 text-2xl font-semibold">192k</p>
								</div>
								<div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
									<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tỷ lệ hủy</p>
									<p className="mt-2 text-2xl font-semibold">1.8%</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
						<CardHeader className="border-b border-border/60 px-6 py-6">
							<CardTitle className="text-xl">Cơ cấu danh mục</CardTitle>
							<CardDescription className="mt-1">
								Tỷ trọng sản phẩm theo nhóm hàng đang kinh doanh.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5 px-6 py-6">
							{categoryMix.map((item) => (
								<div key={item.name} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span className="font-medium">{item.name}</span>
										<span className="text-muted-foreground">{item.value}%</span>
									</div>
									<div className="h-2.5 rounded-full bg-muted/70">
										<div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
									</div>
								</div>
							))}

							<Separator className="my-2" />

							  <div className="rounded-3xl bg-linear-to-br from-amber-50 via-white to-orange-50 p-5">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm font-medium text-amber-700">Mục tiêu tuần này</p>
										<p className="mt-2 text-2xl font-semibold tracking-tight">512 đơn hàng</p>
										<p className="mt-1 text-sm text-muted-foreground">Đã đạt 74% mục tiêu tổng.</p>
									</div>
									<div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
										<p className="text-xs text-muted-foreground">Còn lại</p>
										<p className="text-lg font-semibold">132</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>

				<section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
					<Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
						<CardHeader className="border-b border-border/60 px-6 py-6">
							<CardTitle className="text-xl">Hoạt động gần đây</CardTitle>
							<CardDescription className="mt-1">
								Các sự kiện nổi bật cần chú ý trong hệ thống quản trị.
							</CardDescription>
						</CardHeader>
						<CardContent className="px-0 py-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="pl-6">Sự kiện</TableHead>
										<TableHead>Chi tiết</TableHead>
										<TableHead>Thời gian</TableHead>
										<TableHead className="pr-6 text-right">Trạng thái</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentActivities.map((activity) => (
										<TableRow key={activity.action}>
											<TableCell className="pl-6">
												<div className="flex items-center gap-3">
													<div className={`flex size-9 items-center justify-center rounded-2xl bg-muted/40 ${activity.tone}`}>
														<activity.icon className="size-4" />
													</div>
													<div>
														<p className="font-medium">{activity.action}</p>
													</div>
												</div>
											</TableCell>
											  <TableCell className="max-w-70 text-muted-foreground">{activity.detail}</TableCell>
											<TableCell className="text-muted-foreground">{activity.time}</TableCell>
											<TableCell className="pr-6 text-right">
												<Badge variant="outline" className="border-border/70 bg-muted/30 text-foreground">
													{activity.status}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					<Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
						<CardHeader className="border-b border-border/60 px-6 py-6">
							<CardTitle className="text-xl">Tác vụ nhanh</CardTitle>
							<CardDescription className="mt-1">
								Các thao tác thường dùng cho quản trị viên.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 px-6 py-6">
							<Button variant="outline" className="h-11 w-full justify-between rounded-2xl px-4">
								<span>Thêm sản phẩm mới</span>
								<ArrowUpRight className="size-4" />
							</Button>
							<Button variant="outline" className="h-11 w-full justify-between rounded-2xl px-4">
								<span>Quản lý người dùng</span>
								<Users className="size-4" />
							</Button>
							<Button variant="outline" className="h-11 w-full justify-between rounded-2xl px-4">
								<span>Kiểm tra đơn chờ xử lý</span>
								<Clock3 className="size-4" />
							</Button>

							<Separator className="my-4" />

							<div className="rounded-3xl bg-foreground px-5 py-5 text-background">
								<div className="flex items-center gap-3">
									<div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
										<Sparkles className="size-5 text-amber-300" />
									</div>
									<div>
										<p className="text-sm text-white/70">Gợi ý tối ưu</p>
										<p className="text-base font-semibold">Đẩy 12 sản phẩm nổi bật trong 24 giờ tới.</p>
									</div>
								</div>
								<p className="mt-4 text-sm leading-6 text-white/70">
									Các danh mục điện tử và thời trang đang có tỷ lệ chuyển đổi tốt nhất.
									Đây là điểm nên ưu tiên cho banner và quảng cáo.
								</p>
							</div>
						</CardContent>
					</Card>
				</section>
			</div>
		</main>
	);
}
