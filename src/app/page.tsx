"use client"; // Required for hooks (useState, useEffect)

import React, { useState, useEffect, useRef } from 'react';

// --- shadcn/ui Component Imports ---
// Remember to add these to your project!
// bunx --bun shadcn-ui@latest add button card dialog accordion input
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

// --- Icon Imports ---
import {
  LockIcon,
  SearchCheckIcon,
  WalletIcon,
  XIcon,
  ShieldCheckIcon,
  CpuIcon,
  ChevronDownIcon
} from "lucide-react";

// --- Particle Network Background ---
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // non-null alias so nested functions/classes can safely use width/height
    const canvasEl = canvas as HTMLCanvasElement;

    let particles: Particle[] = [];
    let animationFrameId: number;

    // --- FUNCTION DEFINITIONS MOVED UP ---

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 1.5;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192, 132, 252, 0.5)'; // purple-400
        ctx.fill();
      }

      update() {
        if (this.x < 0 || this.x > canvasEl.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvasEl.height) this.vy = -this.vy;
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvasEl.width * canvasEl.height) / 10000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
          Math.random() * canvasEl.width,
          Math.random() * canvasEl.height,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ));
      }
    };

    const connectParticles = () => {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 120})`; // purple-500
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      particles.forEach(p => p.update());
      particles.forEach(p => p.draw());
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // --- END OF MOVED DEFINITIONS ---

    const resizeCanvas = () => {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      // Re-init particles on resize to fill the new screen size
      initParticles(); // This call is now safe
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // This call is now safe

    // This call was already safe, but now all definitions are grouped
    // initParticles(); 
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed left-0 top-0 z-0 h-full w-full" />;
};


// --- The Main App Component ---

export default function Home() {
  // State for the interactive demo
  const [studentName, setStudentName] = useState("John Doe");

  // State for the Dialogs
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-950 text-white">
      {/* Background Animation */}
      <ParticleNetwork />

      {/* Main Content (on top of canvas) */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed left-0 top-0 z-50 w-full p-4 backdrop-blur-sm">
          <nav className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold tracking-tighter">
                Soul<span className="text-purple-400">Scribe</span>
              </span>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white">
              Connect Wallet
            </Button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex min-h-screen w-full flex-col items-center justify-center p-4 text-center">
          <h1 className="text-5xl font-extrabold tracking-tighter md:text-7xl">
            Stop Faking It.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Start Scribing It.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
            Introducing SoulScribe: The Future of Verifiable Credentials.
            Your achievements, minted as permanent, unforgeable NFTs on the blockchain.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {/* These buttons will trigger dialogs, but you can link them later */}
            <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
              Issue a Demo Certificate
            </Button>
            <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white">
                  Verify a Credential
                </Button>
              </DialogTrigger>
              {/* This is the same dialog content from the "Solution" card below */}
              {/* You might want to make a more generic "Verify" modal here */}
              <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white data-[state=open]:animate-slide-in data-[state=open]:animate-fade-in">
                <DialogHeader>
                  <DialogTitle className="text-green-400">✓ Transaction Verified</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    This data is permanently recorded on the blockchain and cannot be altered.
                  </DialogDescription>
                </DialogHeader>
                <div className="font-mono p-6 pt-0 text-sm text-slate-300">
                  <div className="mb-2"><strong>Token ID:</strong> <span className="text-purple-300">721</span></div>
                  <div className="mb-2"><strong>Contract:</strong> <span className="text-purple-300">0x...SoulScribe</span></div>
                  <div className="mb-2"><strong>Owner:</strong> <span className="text-purple-300">0x...JohnDoe</span></div>
                  <div className="mt-4 rounded-md border border-slate-700 bg-slate-800 p-3">
                    <p><strong>[Metadata]</strong></p>
                    <p>{"{"}</p>
                    <p className="ml-4">"name": "AI Fundamentals",</p>
                    <p className="ml-4">"student": "John Doe",</p>
                    <p className="ml-4">"date": "2025-10-26",</p>
                    <p className="ml-4">"image": "ipfs://QmX..."</p>
                    <p>{"}"}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* --- Interactive Problem/Solution Section --- */}
        <section className="w-full bg-slate-950/50 py-20 backdrop-blur-md">
          <div className="mx-auto max-w-6xl p-4">
            <h2 className="mb-12 text-center text-4xl font-bold tracking-tighter">
              See The Difference
            </h2>
            <div className="grid gap-8 md:grid-cols-2">

              {/* --- The Problem: Fakeable PDF --- */}
              <Card className="border-red-500/30 bg-slate-900/70 text-white">
                <CardHeader>
                  <CardTitle className="text-red-400">The Old Way: The PDF</CardTitle>
                  <CardDescription className="text-slate-400">
                    Traditional certificates are just images. Easy to fake, hard to trust.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border-2 border-dashed border-slate-600 bg-slate-800 p-4">
                    <h4 className="text-center text-xl font-bold">Certificate of Completion</h4>
                    <p className="mt-4 text-center text-lg">This certifies that</p>
                    <p className="my-2 text-center text-3xl font-serif italic text-blue-300">
                      {studentName}
                    </p>
                    <p className="text-center text-lg">
                      has successfully completed the
                    </p>
                    <p className="mt-1 text-center text-xl font-bold">
                      AI Fundamentals Course
                    </p>
                    <p className="mt-4 text-center text-sm text-slate-400">
                      Issued: 2025-10-26
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Alter this Certificate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white data-[state=open]:animate-slide-in data-[state=open]:animate-fade-in">
                      <DialogHeader>
                        <DialogTitle>Photoshop Simulator</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          See how easy it is to fake a traditional certificate. Change the name below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Enter a new name"
                          className="col-span-3 bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="default" className="bg-purple-600 text-white hover:bg-purple-700">Done</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>

              {/* --- The Solution: Verifiable NFT --- */}
              <Card className="border-purple-500/50 bg-slate-900/70 text-white shadow-2xl shadow-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400">The New Way: SoulScribe NFT</CardTitle>
                  <CardDescription className="text-slate-400">
                    Blockchain certificates are immutable, verifiable, and truly owned by you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border-2 border-purple-400/50 bg-slate-800 p-4 shadow-inner shadow-purple-500/10">
                    <h4 className="text-center text-xl font-bold">Certificate of Completion</h4>
                    <p className="mt-4 text-center text-lg">This certifies that</p>
                    <p className="my-2 text-center text-3xl font-serif italic text-blue-300">
                      John Doe
                    </p>
                    <p className="text-center text-lg">
                      has successfully completed the
                    </p>
                    <p className="mt-1 text-center text-xl font-bold">
                      AI Fundamentals Course
                    </p>
                    <p className="mt-4 text-center text-sm text-purple-300">
                      Minted: 2025-10-26
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="w-full bg-purple-600 text-white hover:bg-purple-700">
                        Verify on-Chain
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white data-[state=open]:animate-slide-in data-[state=open]:animate-fade-in">
                      <DialogHeader>
                        <DialogTitle className="text-green-400">✓ Transaction Verified</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          This data is permanently recorded on the blockchain and cannot be altered.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="font-mono p-6 pt-0 text-sm text-slate-300">
                        <div className="mb-2"><strong>Token ID:</strong> <span className="text-purple-300">721</span></div>
                        <div className="mb-2"><strong>Contract:</strong> <span className="text-purple-300">0x...SoulScribe</span></div>
                        <div className="mb-2"><strong>Owner:</strong> <span className="text-purple-300">0x...JohnDoe</span></div>
                        <div className="mt-4 rounded-md border border-slate-700 bg-slate-800 p-3">
                          <p><strong>[Metadata]</strong></p>
                          <p>{"{"}</p>
                          <p className="ml-4">"name": "AI Fundamentals",</p>
                          <p className="ml-4">"student": "John Doe",</p>
                          <p className="ml-4">"date": "2025-10-26",</p>
                          <p className="ml-4">"image": "ipfs://QmX..."</p>
                          <p>{"}"}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" className="w-full" disabled>
                    Alter this Certificate (Impossible)
                  </Button>
                </CardFooter>
              </Card>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24">
          <div className="mx-auto max-w-6xl p-4">
            <h2 className="mb-4 text-center text-sm font-bold uppercase text-purple-400">
              Core Features
            </h2>
            <p className="mb-12 text-center text-4xl font-bold tracking-tighter">
              Built for Trust
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="bg-slate-900/50 border-purple-500/20 text-white backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LockIcon className="text-purple-400" />
                    Immutable Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    Powered by IPFS, your certificate's image and metadata are
                    stored decentrally. No broken links or deleted files, ever.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-purple-500/20 text-white backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SearchCheckIcon className="text-purple-400" />
                    Publicly Verifiable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    Anyone, anywhere, can verify your credential on a public
                    blockchain explorer. True, unforgeable transparency.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-purple-500/20 text-white backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <WalletIcon className="text-purple-400" />
                    True Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    The recipient truly *owns* their achievement. It lives in
                    their personal wallet, not a company's private database.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full bg-slate-950/50 py-24 backdrop-blur-md">
          <div className="mx-auto max-w-4xl p-4">
            <h2 className="mb-12 text-center text-4xl font-bold tracking-tighter">
              How It Works
            </h2>
            <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-0">
              {/* Step 1 */}
              <div className="flex w-full flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 shadow-lg shadow-purple-500/50">
                  <CpuIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">1. Upload & Mint</h3>
                <p className="mt-2 text-slate-300">
                  Admin uploads the certificate and recipient's wallet address.
                </p>
              </div>

              {/* Connector */}
              <div className="h-0.5 w-1/3 rotate-90 border-t-2 border-dashed border-purple-400/50 md:rotate-0"></div>

              {/* Step 2 */}
              <div className="flex w-full flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 shadow-lg shadow-purple-500/50">
                  <LockIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">2. Secure on IPFS</h3>
                <p className="mt-2 text-slate-300">
                  Data is stored on IPFS and an NFT is minted to the blockchain.
                </p>
              </div>

              {/* Connector */}
              <div className="h-0.5 w-1/3 rotate-90 border-t-2 border-dashed border-purple-400/50 md:rotate-0"></div>

              {/* Step 3 */}
              <div className="flex w-full flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 shadow-lg shadow-purple-500/50">
                  <WalletIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">3. Receive NFT</h3>
                <p className="mt-2 text-slate-300">
                  The recipient receives the verifiable certificate in their Web3 wallet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section className="w-full py-24">
          <div className="mx-auto max-w-3xl p-4">
            <h2 className="mb-12 text-center text-4xl font-bold tracking-tighter">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-slate-700">
                <AccordionTrigger>What is a "Soulbound" token?</AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  A Soulbound Token (SBT) is a type of NFT that is non-transferable. Once it's minted to a wallet, it cannot be sold or sent to another wallet. This makes it perfect for personal achievements, like a driver's license or a university degree, because it's tied to *you*.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-slate-700">
                <AccordionTrigger>Why not just use a database?</AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  A private database is a "black box." An employer has to trust that the data you show them is real and hasn't been tampered with. A blockchain is publicly verifiable. An employer doesn't have to trust you *or* us; they can trust the math of the blockchain itself.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-slate-700">
                <AccordionTrigger>What is IPFS?</AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  IPFS stands for InterPlanetary File System. Think of it as a decentralized version of the internet's storage. Instead of a file living on a single server (like `company.com/my-image.jpg`), it's identified by its content. This means the link is permanent and can't be broken or deleted by a single entity.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-slate-700">
                <AccordionTrigger>What blockchain do you use?</AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  SoulScribe is built to be "chain-agnostic," but we strongly recommend L2 solutions like Polygon, Arbitrum, or Optimism. These chains offer the same security as Ethereum but with transaction (minting) fees that cost fractions of a cent, making it affordable to issue thousands of certificates.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="w-full bg-slate-950/50 py-24 backdrop-blur-md">
          <div className="mx-auto max-w-4xl p-4 text-center">
            <h2 className="text-4xl font-extrabold tracking-tighter">
              Ready to Secure Your Legacy?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Join the new standard of trust. Whether you're an institution, a boot camp, or an online creator, SoulScribe is ready to power your verifiable credentials.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
                Start Minting Now
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12">
          <div className="mx-auto max-w-6xl p-4 text-center text-slate-400">
            <div className="mb-4 flex items-center justify-center gap-2">
              <ShieldCheckIcon className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold tracking-tighter">
                Soul<span className="text-purple-400">Scribe</span>
              </span>
            </div>
            <p>
              Powered by Next.js, TypeScript, shadcn/ui, and Bun.
            </p>
            <p className="mt-2 text-sm">
              Making the world a more verifiable place, one block at a time.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

