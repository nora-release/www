import type { LocaleTranslation } from "../translations";
import { emailLink } from "./shared";

export const ja = {
  common: {
    skipToContent: "本文へスキップ",
  },
  header: {
    appStore: "Download Nora",
    backToMenuAria: "メニューに戻る",
    closeMenuAria: "メニューを閉じる",
    homeAria: "Nora ホーム",
    logoAlt: "Nora ロゴ",
    menuAria: "メニューを開く",
    nav: {
      changelog: "変更履歴",
      privacy: "プライバシー",
      support: "サポート",
      terms: "規約",
    },
    primaryNavigationAria: "メインナビゲーション",
  },
  footer: {
    appStoreButton: "Download Nora",
    copyright: "All rights reserved.",
    ctaText: "Nora の DMG をダウンロード。",
    ctaTitle: "より自分らしい AI エージェントを始めませんか？",
    description: "AI 体験をひとつにまとめる、美しいデスクトップアプリです。",
    groups: {
      legal: "法務",
      product: "製品",
      resources: "リソース",
    },
    language: "言語",
    legalLinks: {
      privacy: "プライバシー",
      terms: "規約",
    },
    productLinks: {
      faq: "FAQ",
    },
    resourceLinks: {
      changelog: "変更履歴",
      support: "サポート",
    },
    systemStatus: "すべてのシステムは正常です",
  },
  meta: {
    changelog: {
      title: "変更履歴 - Nora",
      description: "Nora のリリースノート、改善、修正、更新履歴を確認できます。",
    },
    home: {
      title: "Nora - AI 体験をひとつに",
      description:
        "Nora は macOS ファーストのローカルエージェントチャットアプリです。自分の Mac 上で、コーディングや生産性向けのエージェントを動かせます。",
    },
    privacy: {
      title: "プライバシーポリシー - Nora",
      description:
        "Nora のプライバシーポリシーでは、ローカルデータ、認証情報、権限、任意の分析、Web サイトデータの扱いについて説明します。",
    },
    support: {
      title: "サポート - Nora",
      description: "Nora のサポート連絡先、インストール要件、トラブルシューティングについて確認できます。",
    },
    terms: {
      title: "利用規約 - Nora",
      description: "Nora の利用規約では、アプリのライセンス、利用上の責任、サポート連絡先について説明します。",
    },
  },
  home: {
    structuredDataFeatureList: ["macOS ファーストのローカルエージェントチャット", "複数モデルプロバイダー対応", "サンドボックスでのファイル変更レビュー", "ローカルスキルとワークフロー"],
    hero: {
      appStoreButton: "Download Nora",
      builtWithLabel: "構成",
      builtWithValue: "100% ネイティブ",
      systemLabel: "システム",
      systemValue: "macOS 14.0+",
      tagline: "OpenAI、Anthropic、Google Gemini、カスタムプロバイダーのための美しいデスクトップアプリ。作業の流れを止めずにモデルを切り替えられます。",
      titleLines: [
        ["Nora が", "ひとつに"],
        ["AI 体験を", "まとめます。"],
      ],
    },
    featureCards: {
      eyebrow: "その他の機能",
      title: "実際の仕事に使える細部まで。",
      subtitle: "エンジニアからアーティスト、デザイナーから農家まで -\nNora は人と、すでに使っているツールをつなぎます。",
      items: [
        {
          title: "カレンダー",
          caption: "予定、ミーティングブリーフ、フォローアップをひとつのエージェントワークスペースで扱えます。",
        },
        {
          title: "ファイル",
          caption: "ローカルファイルの確認、比較、整理を、管理されたエージェント操作で進められます。",
        },
        {
          title: "ブラウザ",
          caption: "Nora がページを読み取り、文脈を要約し、ブラウザ上の作業を手伝います。",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "よくある質問",
      items: [
        {
          question: "Nora とは何ですか？",
          answer:
            "Nora は macOS ファーストのローカルエージェントチャットアプリです。自分の Mac 上で、コーディングや生産性向けのエージェントを動かせます。",
        },
        {
          question: "Nora は local-first ですか？",
          answer:
            "はい。プロバイダーの認証情報、エージェントの状態、スキル、スケジュール、サンドボックスワークフローは、デスクトップアプリがローカルで管理します。",
        },
        {
          question: "どのモデルプロバイダーに対応していますか？",
          answer:
            "OAuth、API キー、サブスクリプション、ゲートウェイ、OpenAI 互換ルートに対応します。OpenAI、Anthropic、Google Gemini、Bedrock、Azure、Cloudflare、Cerebras、カスタムエンドポイントを利用できます。",
        },
        {
          question: "ファイル変更はどのように確認できますか？",
          answer:
            "エージェントの編集はまずサンドボックス内で行われます。ホストのファイルシステムに反映する前に、変更内容を確認し、選んだファイルだけ受け入れる、すべて受け入れる、または実行を破棄できます。",
        },
        {
          question: "スキルとは何ですか？",
          answer:
            "スキルは SKILL.md を入口にしたローカルの機能パッケージです。Nora は有効なスキルをエージェントに提示し、タスクで必要になったときだけ関連する手順を読み込みます。",
        },
      ],
    },
  },
  legal: {
    privacy: {
      eyebrow: "プライバシー",
      title: "プライバシーポリシー",
      updated: "最終更新日: 2026年6月15日",
      sections: [
        {
          title: "概要",
          paragraphs: [
            [
              "Nora は macOS ファーストのローカルエージェントチャットアプリです。モデル認証情報、agent 状態、スキル、スケジュール、サンドボックスワークフロー、ワークスペースファイルを Mac 上で管理するよう設計されています。Nora は、モデルプロバイダーに接続するとき、アプリをダウンロードまたは更新するとき、provider の使用量を確認するとき、または agent に外部サービスの利用を依頼するときにネットワークリクエストを行います。",
            ],
          ],
        },
        {
          title: "ローカルアプリデータ",
          paragraphs: [
            [
              "チャット履歴、agent イベント、provider 設定、認証情報、token、使用量スナップショット、スキル、スケジュール、サンドボックス状態、ワークスペースファイル、選択したローカルファイルは、あなたの Mac または選択した場所に残ります。外部サービスへ送信することを選んだ場合、またはサポート依頼に含めた場合を除き、Nora がこれらの内容を Nora サーバーへアップロードすることはありません。",
            ],
          ],
        },
        {
          title: "モデルプロバイダーと外部サービス",
          paragraphs: [
            [
              "OpenAI、Anthropic、Google Gemini、Bedrock、Azure、Cloudflare、Cerebras、ゲートウェイ、OpenAI 互換エンドポイントを使う場合、Nora は prompt、選択したコンテキスト、agent に使用を許可したファイルや内容をその provider に送信します。これらの provider は、それぞれの規約とプライバシーポリシーに従ってリクエストを処理します。",
            ],
            [
              "サポート連絡では、生の API キー、access token、session cookie、その他の秘密情報を送らないでください。Provider 認証情報はアプリ内とあなたの Mac 上に保管するためのものです。",
            ],
          ],
        },
        {
          title: "Agent、サンドボックス、スキル",
          paragraphs: [
            [
              "Agent の作業は、あなたが開始または承認したワークフローの中で、ファイルの読み取り、ツール実行、ファイル変更の提案を行います。コーディング変更はホストのファイルシステムに触れる前にサンドボックスで確認でき、選択したファイルだけ受け入れる、すべて受け入れる、または実行を破棄できます。",
            ],
            [
              "スキルは説明を含むローカルの機能パッケージです。タスクに必要な場合、Nora は関連するスキル説明を agent に提示します。インポート、同期、ピン留め、有効化されたスキルは、デスクトップアプリがローカルで管理します。",
            ],
          ],
        },
        {
          title: "macOS 権限",
          paragraphs: [
            [
              "Nora は、ファイルアクセス、アクセシビリティ、画面アクセス、自動化、通知などの macOS 権限を求めることがあります。これらの権限は、あなたが使用するローカル agent、デスクトップ自動化、ファイルレビュー、サンドボックスワークフロー、通知機能のためにのみ使われます。権限はシステム設定で管理できます。",
            ],
          ],
        },
        {
          title: "診断とサポート",
          paragraphs: [
            [
              "Nora は、アプリの動作とトラブルシューティングのために、ローカルログ、実行状態、provider 使用量スナップショット、エラー詳細を Mac 上に保存することがあります。サポートへ連絡する場合、共有する情報はあなたが選択します。診断情報を送る前に、認証情報、token、私的なファイル、関係のない個人情報を取り除いてください。",
            ],
          ],
        },
        {
          title: "Web サイト",
          paragraphs: [
            [
              "この Web サイトにアクセスすると、ホスティングおよびインフラ提供者が、IP アドレス、ブラウザ user agent、リクエスト URL、リクエスト時刻などの標準サーバーログデータを、セキュリティ、診断、Web サイト配信のために処理することがあります。この Web サイトは広告トラッカーを使用しません。",
            ],
          ],
        },
        {
          title: "変更とお問い合わせ",
          paragraphs: [["Nora の変更に伴い、このポリシーを更新することがあります。プライバシーに関する質問は ", emailLink, " までご連絡ください。"]],
        },
      ],
    },
    support: {
      eyebrow: "サポート",
      title: "Nora サポート",
      updated: "Nora for macOS のヘルプ。",
      sections: [
        {
          title: "お問い合わせ",
          paragraphs: [["製品サポート、バグ報告、セットアップに関する質問、フィードバックは ", emailLink, " までメールしてください。"]],
        },
        {
          title: "含めてほしい情報",
          paragraphs: [
            [
              "問題を報告する際は、macOS バージョン、Nora バージョン、Mac モデル、選択したモデルプロバイダー、認証方式、実行していたタスク、短い説明を含めてください。画面上の問題では、スクリーンショットや短い動画が役立ちます。",
            ],
          ],
        },
        {
          title: "インストールと更新",
          paragraphs: [
            [
              "Nora は DMG インストーラで配布されます。ダウンロード、インストール、更新で問題が起きた場合は、システムバージョン、アプリバージョン、エラー画面を添えてご連絡ください。",
            ],
          ],
        },
        {
          title: "モデルと認証情報",
          paragraphs: [
            [
              "モデル接続の問題では、プロバイダー、モデル名、ルート種別、OAuth・API キー・サブスクリプション・ゲートウェイ・OpenAI 互換エンドポイントのどれを使っているかを含めてください。生の API キーや access token は送らないでください。",
            ],
          ],
        },
        {
          title: "ローカル agent とサンドボックス実行",
          paragraphs: [
            [
              "コーディングやファイル変更の問題では、ワークスペースパス、サンドボックスを使ったか、選択したファイルだけ受け入れたか、すべて受け入れたか、実行を破棄したかを含めてください。agent がエラーで止まった場合は、画面に表示されたエラーテキストをコピーしてください。",
            ],
          ],
        },
        {
          title: "スキルとスケジュール",
          paragraphs: [
            [
              "スキルの問題では、スキル名、入手元、有効・ピン留め・インポート・フォルダ同期の状態を含めてください。スケジュールされたタスクの問題では、タスク名、実行タイミング、直近の実行結果を含めてください。",
            ],
          ],
        },
        {
          title: "macOS 権限",
          paragraphs: [
            [
              "一部の agent ワークフローでは、アクセシビリティ、ファイルアクセス、画面アクセスなどの macOS 権限が必要です。Nora がアプリを読み取れない、または操作できない場合は、システム設定を確認し、影響を受けたアプリ名を報告に含めてください。",
            ],
          ],
        },
        {
          title: "プライバシー",
          paragraphs: [["プロバイダー認証情報、agent 状態、スキル、スケジュール、サンドボックス実行結果、ワークスペースファイルは、デスクトップアプリがローカルで管理します。詳しくは ", { href: "/privacy", text: "プライバシーポリシー" }, " をお読みください。"]],
        },
      ],
    },
    terms: {
      eyebrow: "規約",
      title: "利用規約",
      updated: "最終更新日: 2026年6月15日",
      sections: [
        {
          title: "アプリライセンス",
          paragraphs: [
            [
              "Nora は、ローカル AI チャット、coding agent、productivity agent、desktop workflows のための macOS desktop application です。あなたが管理するデバイスにインストールして使用できますが、適用法、model provider の規約、この規約を守る必要があります。",
            ],
          ],
        },
        {
          title: "モデルプロバイダーと外部サービス",
          paragraphs: [
            [
              "Nora は OpenAI、Anthropic、Google Gemini、Bedrock、Azure、Cloudflare、Cerebras、gateway、OpenAI-compatible endpoint に接続できます。接続するアカウント、認証情報、利用量、料金、各 provider のポリシーはあなたの責任で管理してください。",
            ],
            [
              "サポート連絡では provider credentials、API keys、tokens、session cookies、その他の secret を送らないでください。",
            ],
          ],
        },
        {
          title: "Agent の作業",
          paragraphs: [
            [
              "Nora または接続した agent に扱わせる prompts、files、code、commands、automations、outputs についてはあなたが責任を負います。ファイル変更や agent actions を受け入れる前に内容を確認してください。",
            ],
            [
              "Sandbox workflows、skills、schedules、desktop automation features は、あなたの workflow のための道具です。Nora が何を読み取り、実行し、変更し、外部 provider に送るかはあなたが判断してください。",
            ],
          ],
        },
        {
          title: "許可される使用",
          paragraphs: [
            [
              "Nora を、法律違反、アクセス制御の回避、外部サービスの悪用、他システムへの妨害、または使用権限のない content の処理に使わないでください。",
            ],
          ],
        },
        {
          title: "プライバシー",
          paragraphs: [["Nora のプライバシー慣行は ", { href: "/privacy", text: "プライバシーポリシー" }, " に記載されています。"]],
        },
        {
          title: "お問い合わせ",
          paragraphs: [["この規約について質問がある場合は ", emailLink, " までご連絡ください。"]],
        },
      ],
    },
  },
  changelog: {
    description: "製品アップデート、修正、リリースノート。",
    eyebrow: "変更履歴",
    intro: "製品アップデート、修正、リリースノート。",
    linkVersionLabel: "バージョンへのリンク",
    title: "Nora 変更履歴",
  },
} satisfies LocaleTranslation;
