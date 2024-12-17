'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/contexts/CartContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import Link from 'next/link'
import Image from 'next/image'

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod')
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    notes: '',
  })

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      const requiredFields: (keyof ShippingInfo)[] = ['fullName', 'email', 'phone', 'address', 'province', 'district', 'ward']
      const missingFields = requiredFields.filter(field => !shippingInfo[field])
      
      if (missingFields.length > 0) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Create order payload
      const order = {
        items,
        shippingInfo,
        paymentMethod,
        total,
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (paymentMethod === 'vnpay') {
        // Redirect to VNPAY payment page
        // In a real application, you would get the URL from your backend
        window.location.href = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${total}&orderInfo=${encodeURIComponent(JSON.stringify(order))}`
      } else {
        // Handle COD order
        clearCart()
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your order. We will contact you shortly.",
        })
        router.push('/order-success')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg mb-4">Your cart is empty</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
              <CardDescription>
                Bạn đã có tài khoản?{' '}
                <Link href="/auth" className="text-blue-600 hover:underline">
                  Đăng nhập
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tỉnh/thành phố</Label>
                    <Select
                      value={shippingInfo.province}
                      onValueChange={(value) => handleSelectChange('province', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hochiminh">Hồ Chí Minh</SelectItem>
                        {/* Add more provinces */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quận/Huyện</Label>
                    <Select
                      value={shippingInfo.district}
                      onValueChange={(value) => handleSelectChange('district', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Quận/Huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="district1">Quận 1</SelectItem>
                        <SelectItem value="district2">Quận 2</SelectItem>
                        {/* Add more districts */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Phường/Xã</Label>
                    <Select
                      value={shippingInfo.ward}
                      onValueChange={(value) => handleSelectChange('ward', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Phường/Xã" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ward1">Phường 1</SelectItem>
                        <SelectItem value="ward2">Phường 2</SelectItem>
                        {/* Add more wards */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={shippingInfo.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Phương thức thanh toán</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: 'cod' | 'vnpay') => setPaymentMethod(value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2">
                        <Image
                          src="/placeholder.svg"
                          alt="COD"
                          width={32}
                          height={32}
                        />
                        Thanh toán khi nhận hàng (COD)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="vnpay" id="vnpay" />
                      <Label htmlFor="vnpay" className="flex items-center gap-2">
                        <Image
                          src="/placeholder.svg"
                          alt="VNPAY"
                          width={32}
                          height={32}
                        />
                        Thanh toán qua VNPAY
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.selectedColor} - {item.selectedSize} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{shipping === 0 ? 'Miễn phí' : `$${shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

